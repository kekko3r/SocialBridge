import React, { useState, useEffect } from "react";
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata

function Dashboard() {

    // Stato per gli utenti
    const [users, setUsers] = useState([]);

    const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("jwtToken"); // Rimuove il token dal localStorage ed eseguo il vero logout
    window.location.href = "/login"; // Reindirizza alla login
    };

    // Effettua la chiamata API quando il componente viene montato
    useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get("rottauno/users");
            setUsers(response.data); // Aggiorna lo stato con i dati degli utenti
        } catch (error) {
        console.error("Errore nel recupero degli utenti:", error);
        }
    };

    if(users.length === 0)
        fetchUsers();
    }, [users]); // L'array alla fine [users] indica che l'effetto viene eseguito all'inziio e ogni volta che si aggiorna la variabile "users" e si riesegue la funzione di "return"
//se oltre a [users], avessi avuto una cosa del genere: [users,abc] dove abc è un altro stato
//allora vuol dire che basta che cambia lo stato contatore o abc e si riesegure la funzione "return"
//Se Invece lascio [] significa che useEffect VERRA ESEGUITO UNA ED UNA SOLA VOLTA
//SE PURE ABBIAMO [] E VEDIAMO CHE SI ESEGUE DUE VOLTE. E CAUSATO DALLO STRICTMODE IN INDEX.JS
//LO STRINCT MODE DICE CHE SIAMO IN FASE DI SVILUPPO QUINDI LO FA ESEGUIRE DUE VOLTE CHE SERVE PRE IL DEBBUGGING
//PERO SE NON METTIAMO DEGLI IF SIGNIFICA CHE ESEGUE DUE VOLTE UNA FUNZIONE CHE CI PUO CAMBIARE STATO E NON VA BENE 

// A cosa serve <> e </>? 
//React in poche parole vuole che se creiamo dei fratelli nel DOM HTML devono essere sempre figli di qualcuno
//altrimenti da errore
//Se il padre è rilevante, li si può racchiudere in un <div></div> e all interno del div abvere dei fratelli
//Se il padre non è rilevante, si può mettere come padre un 'fragment'
//Che è tipo un div invisibile e si mette con <> </> e all'interno ci possono piu cose che sono fratelli
  return (
    <>
        <h1>Dashboard (Protetta)</h1>
        <form onSubmit={handleLogout}>
        <button type="submit">Logout</button>
        </form>

        <h2>Lista Utenti:</h2>
        <ul>
            {users.length > 0 ? (
            users.map((user) => (
                <li key={user._id}>
                <a href={"/dashboard/" + user._id}>{user.nome} - {user.email}</a>
                </li>
            ))
            ) : (
            <p>Caricamento utenti in corso...</p>
            )}
        </ul>
    </>
  );
}

export default Dashboard;