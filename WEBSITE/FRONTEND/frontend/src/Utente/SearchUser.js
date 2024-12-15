import React, { useState } from "react";
import axios from "../Config/axiosConfig";
import './SearchUser.css';

const SearchUser = () => {
    // Stati per nome, cognome, risultati e errori
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    // Funzione per cercare l'utente
    const searchUser = async () => {
        try {
            setError(""); // Reset dell'errore
            setResults([]); // Reset dei risultati della ricerca precedente
            const response = await axios.get('api/users/search', {
                params: { nome, cognome }
            });
            setResults(response.data); // Salva i risultati nel stato
        } catch (err) {
            setError(err.response?.data?.message || "Errore durante la ricerca");
        }
    };

    return (
        <div className="search-container">
            <h2>Ricerca Utente</h2>
            <div>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)} // Aggiorna lo stato del nome
                />
                <input
                    type="text"
                    placeholder="Cognome"
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)} // Aggiorna lo stato del cognome
                />
                <button onClick={searchUser}>Cerca</button>
            </div>
            {error && <p className="error">{error}</p>} {/* Mostra errori */}
            <div>
                <h3>Risultati:</h3>
                <ul>
                    {results.map((user) => (
                        <li key={user._id}>
                            {user.nome} {user.cognome} - {user.email}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SearchUser;