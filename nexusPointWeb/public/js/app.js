document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const msg = document.getElementById('msg');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        msg.textContent = 'Verificando...';
        
        const correoValue = document.getElementById('usuario').value.trim();
        const contrasenaValue = document.getElementById('contrasena').value;

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    email: correoValue, 
                    password_usuario: contrasenaValue 
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors && data.errors.email) {
                    msg.textContent = data.errors.email[0];
                } else {
                    msg.textContent = data.message || 'Credenciales incorrectas.';
                }
                return;
            }

            if (!data.token) {
                msg.textContent = 'Error: No se recibió el token del servidor.';
                return;
            }

            localStorage.setItem('token', data.token);
            msg.style.color = 'green';
            msg.textContent = '¡Éxito! Redirigiendo...';

            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);

        } catch (error) {
            msg.textContent = 'Error de conexión: ' + error.message;
        }
    });
});