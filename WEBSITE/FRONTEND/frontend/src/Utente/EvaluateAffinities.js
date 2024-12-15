import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata
import './EvaluateAffinities.css'; // Importa il CSS di stile

function EvaluateAffinita() {
    const { participantID } = useParams(); // Ottieni participantID dall'URL
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0); // Stato per la valutazione
    const [comment, setComment] = useState(""); // Stato per il commento

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (token) {
                    const response = await axiosInstance.get(`/api/users/${participantID}`);
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Errore nel recupero dell'utente", error);
                setError("Errore nel recupero dell'utente. Riprova.");
            }
        };
        fetchUser();
    }, [participantID]);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            const user = localStorage.getItem("user");
            if (token) {
                await axiosInstance.post(`/api/affinities/creaAffinita`, {
                    user,
                    participantID,
                    rating,
                    comment
                });
                alert("Commento e valutazione creati con successo!");
            }
        } catch (error) {
            try {
                const token = localStorage.getItem("jwtToken");
                const user = localStorage.getItem("user");
                if (token) {
                    await axiosInstance.patch(`/api/affinities/updateRatingAndComment`, {
                        user,
                        participantID,
                        rating,
                        comment
                    });
                    alert("Commento e valutazione aggiornati con successo!");
                }
            } catch (error) {
                console.error("Errore nell'aggiornamento del commento e della valutazione", error);
                setError("Errore nell'aggiornamento del commento e della valutazione. Riprova.");
            }
        }
    };

    return (
        <div>
            <h1>Valuta Affinità</h1>
            {error && <p className="error-message">{error}</p>}
            {user ? (
                <div className="form-container">
                    <p><strong>Nome:</strong> {user.nome}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <form onSubmit={handleCommentSubmit}>
                        <label>
                            Valutazione:
                            <StarRating rating={rating} onRatingChange={handleRatingChange} />
                        </label>
                        <label>
                            Commento:
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </label>
                        <button type="submit">Invia</button>
                    </form>
                </div>
            ) : (
                <p>Caricamento utente...</p>
            )}
        </div>
    );
}

const StarRating = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseOver = (index) => {
        setHoverRating(index + 1);
    };

    const handleMouseOut = () => {
        setHoverRating(0);
    };

    const handleClick = (index) => {
        onRatingChange(index + 1);
    };

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => (
                <span
                    key={index}
                    className={`star ${index < (hoverRating || rating) ? 'filled' : ''}`}
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleClick(index)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

export default EvaluateAffinita;