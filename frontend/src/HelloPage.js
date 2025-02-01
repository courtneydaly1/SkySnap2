import React, { useEffect, useState } from 'react';

function HelloPage() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchHelloWorld() {
            const token = localStorage.getItem('token')
            try {
                const response = await fetch('http://127.0.0.1:5000/hello', {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: 'same-origin'  
                });
                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error('Error fetching hello world:', error);
            }
        }

        fetchHelloWorld();
    }, []);

    return (
        <div>
            <h1>{message || 'Loading...'}</h1>
        </div>
    );
}

export default HelloPage;
