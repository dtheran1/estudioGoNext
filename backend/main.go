package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


type Todo struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}

var todos = []Todo{}
var nextID = 1

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders: []string{"Content-Type"},
	}))

	r.GET("/todos", getTodos)
	r.POST("/todos", createTodo)
	r.DELETE("/todos/:id", deleteTodo)
	r.PATCH("/todos/:id", completeTodo)

	r.Run(":8080")
}


func getTodos(c *gin.Context) {
	c.JSON(http.StatusOK, todos)
}

func createTodo(c *gin.Context) {
	var input struct {
		Title string `json:"title"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo := Todo{
		ID:        nextID,
		Title:     input.Title,
		Completed: false,
	}

	todos = append(todos, todo)
	nextID++

	c.JSON(http.StatusCreated, todo)
}

func deleteTodo(c *gin.Context) {
	id := c.Param("id")

	for i, todo := range todos {
		if strconv.Itoa(todo.ID) == id {
			todos = append(todos[:i], todos[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "deleted"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
}

func completeTodo(c *gin.Context) {
	id := c.Param("id")

	for i, todo := range todos {
		if strconv.Itoa(todo.ID) == id {
			todos[i].Completed = true
			c.JSON(http.StatusOK, todos[i])
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
}

