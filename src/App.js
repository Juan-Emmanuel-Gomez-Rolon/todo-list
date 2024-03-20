import React, {useState, useEffect} from "react";
import "./App.css";

const App = () => {
    // Estado para almacenar la lista de tareas
    const [todos, setTodos] = React.useState([]);
    // Estado para manejar la tarea que se está editando
    const [todoEditing, setTodoEditing] = React.useState(null);

    // Efecto para cargar las tareas almacenadas en el localStorage cuando se monta el componente
    useEffect(() => {
        const json = localStorage.getItem("todos");
        const loadedTodos = JSON.parse(json);
        if (loadedTodos) {
            setTodos(loadedTodos);
        }
    }, []);

    // Efecto para guardar las tareas en el localStorage cada vez que se actualiza la lista de tareas
    useEffect(() => {
        if(todos.length > 0) {
            const json = JSON.stringify(todos);
            localStorage.setItem("todos", json);
        }
    }, [todos]);

    // Función para manejar el envío del formulario de agregar una nueva tarea
    function handleSubmit(e) {
        e.preventDefault();
        let todo = document.getElementById('todoAdd').value
        const newTodo = {
            id: new Date().getTime(),
            text: todo.trim(),
            completed: false,
        };
        if (newTodo.text.length > 0 ) {
            setTodos([...todos].concat(newTodo));
        } else {
            alert("Enter Valid Task");
        }
        document.getElementById('todoAdd').value = ""
    }

    // Función para eliminar una tarea
    function deleteTodo(id) {
        let updatedTodos = [...todos].filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
    }

    // Función para cambiar el estado de completado de una tarea
    function toggleComplete(id) {
        let updatedTodos = [...todos].map((todo) => {
            if (todo.id === id) {
                todo.completed = !todo.completed;
            }
            return todo;
        });
        setTodos(updatedTodos);
    }

    // Función para manejar la edición de una tarea
    function submitEdits(newtodo) {
        const updatedTodos = [...todos].map((todo) => {
            if (todo.id === newtodo.id) {
                todo.text = document.getElementById(newtodo.id).value;
            }
            return todo;
        });
        setTodos(updatedTodos);
        setTodoEditing(null);
    }

    // Componente de la aplicación
    return (
        <div id="todo-list">
            <h1>Lista de Tareas</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="todoAdd"
                />
                <button type="submit">Agregar Tarea</button>
            </form>
            {todos.map((todo) => (
                <div key={todo.id} className="todo">
                    <div className="todo-text">
                        {/* Agregar casilla de verificación para marcar como completado */}
                        <input
                            type="checkbox"
                            id="completed"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo.id)}
                        />
                        {/* Si está en modo de edición, mostrar campo de entrada, sino mostrar texto */}
                        {todo.id === todoEditing ?
                            (<input
                                type="text"
                                id={todo.id}
                                defaultValue={todo.text}
                            />) :
                            (<div>{todo.text}</div>)
                        }
                    </div>
                    <div className="todo-actions">
                        {/* Si está en modo de edición, permitir enviar la edición, sino permitir editar */}
                        {todo.id === todoEditing ?
                            (
                                <button onClick={() => submitEdits(todo)}>Enviar Edición</button>
                            ) :
                            (
                                <button onClick={() => setTodoEditing(todo.id)}>Editar</button>
                            )}
                        <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default App;