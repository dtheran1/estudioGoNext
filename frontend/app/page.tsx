"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setError("No se pudo conectar con el servidor."))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch("http://localhost:8080/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const newTodo = await res.json();
    setTodos((prev) => [...prev, newTodo]);
    setTitle("");
  }

  async function handleDelete(id: number) {
    await fetch(`http://localhost:8080/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleComplete(id: number) {
    const res = await fetch(`http://localhost:8080/todos/${id}`, {
      method: "PATCH",
    });

    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  if (loading) {
    return <p className="text-center mt-16 text-gray-500">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center mt-16 text-red-500">{error}</p>;
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Tareas</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-3 border rounded">
            <span className={todo.completed ? "line-through text-gray-400" : ""}>
              {todo.title}
            </span>
            <div className="flex gap-2">
              {!todo.completed && (
                <button onClick={() => handleComplete(todo.id)} className="text-green-600 text-sm">
                  Completar
                </button>
              )}
              <button onClick={() => handleDelete(todo.id)} className="text-red-500 text-sm">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
