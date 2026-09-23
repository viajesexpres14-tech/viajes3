/* =========================================
   SISTEMA DEL USUARIO
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       COMPROBAR SESIÓN
       ===================================== */

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );


    if (!currentUser) {

        window.location.href = "index.html";

        return;

    }


    // Si intenta entrar como administrador
    if (currentUser.role === "admin") {

        window.location.href = "admin.html";

        return;

    }


    /* =====================================
       MOSTRAR INFORMACIÓN DEL USUARIO
       ===================================== */

    const userName =
        document.getElementById("userName");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePhone =
        document.getElementById("profilePhone");


    if (userName) {
        userName.textContent = currentUser.name;
    }

    if (profileName) {
        profileName.textContent = currentUser.name;
    }

    if (profileEmail) {
        profileEmail.textContent = currentUser.email;
    }

    if (profilePhone) {
        profilePhone.textContent = currentUser.phone;
    }


    /* =====================================
       DATOS DEL CALENDARIO
       ===================================== */

    let availability = JSON.parse(
        localStorage.getItem("travelAvailability")
    ) || {};


    let reservations = JSON.parse(
        localStorage.getItem("travelReservations")
    ) || [];


    let currentDate = new Date();

    let selectedDate = null;


    /* =====================================
       ELEMENTOS DEL CALENDARIO
       ===================================== */

    const calendar =
        document.getElementById("calendar");

    const currentMonth =
        document.getElementById("currentMonth");

    const previousMonth =
        document.getElementById("previousMonth");

    const nextMonth =
        document.getElementById("nextMonth");


    /* =====================================
       NOMBRE DE LOS MESES
       ===================================== */

    const monthNames = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    /* =====================================
       FORMATEAR FECHA
       ===================================== */

    function formatDate(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    /* =====================================
       GENERAR CALENDARIO
       ===================================== */

    function renderCalendar() {

        if (!calendar) return;


        calendar.innerHTML = "";


        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        currentMonth.textContent =
            `${monthNames[month]} ${year}`;


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const lastDay =
            new Date(
                year,
                month + 1,
                0
            );


        let startingDay =
            firstDay.getDay();


        // Convertir domingo = 6
        startingDay =
            startingDay === 0
                ? 6
                : startingDay - 1;


        // Espacios antes del primer día
        for (
            let i = 0;
            i < startingDay;
            i++
        ) {

            const empty =
                document.createElement("div");

            calendar.appendChild(empty);

        }


        // Días del mes
        for (
            let day = 1;
            day <= lastDay.getDate();
            day++
        ) {

            const date =
                new Date(
                    year,
                    month,
                    day
                );


            const dateString =
                formatDate(date);


            const button =
                document.createElement("button");


            button.className =
                "calendar-day";


            button.textContent =
                day;


            // Fecha disponible
            if (
                availability[dateString] === true
            ) {

                button.classList.add(
                    "available"
                );

                button.disabled = false;


                button.addEventListener(
                    "click",
                    () => selectDate(dateString)
                );

            } else {

                button.classList.add(
                    "unavailable"
                );

                button.disabled = true;

            }


            // Fecha seleccionada
            if (
                selectedDate === dateString
            ) {

                button.classList.add(
                    "selected"
                );

            }


            // Fecha actual
            const today =
                new Date();


            if (
                formatDate(today) === dateString
            ) {

                button.classList.add(
                    "today"
                );

            }


            calendar.appendChild(button);

        }

    }


    /* =====================================
       SELECCIONAR FECHA
       ===================================== */

    function selectDate(date) {

        selectedDate = date;


        const selectedDateInput =
            document.getElementById(
                "selectedDate"
            );


        if (selectedDateInput) {

            selectedDateInput.value =
                date;

        }


        renderCalendar();

    }


    /* =====================================
       CAMBIAR MES
       ===================================== */

    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() - 1
                );

                renderCalendar();

            }
        );

    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() + 1
                );

                renderCalendar();

            }
        );

    }


    /* =====================================
       REALIZAR RESERVA
       ===================================== */

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!selectedDate) {

                    alert(
                        "Selecciona una fecha disponible."
                    );

                    return;

                }


                const destination =
                    document.getElementById(
                        "destination"
                    ).value;


                const people =
                    document.getElementById(
                        "people"
                    ).value;


                const notes =
                    document.getElementById(
                        "notes"
                    ).value;


                if (!destination) {

                    alert(
                        "Selecciona un destino."
                    );

                    return;

                }


                const reservation = {

                    id: Date.now(),

                    userId:
                        currentUser.id,

                    userName:
                        currentUser.name,

                    userEmail:
                        currentUser.email,

                    destination:
                        destination,

                    date:
                        selectedDate,

                    people:
                        Number(people),

                    notes:
                        notes,

                    paymentStatus:
                        "pending",

                    reservationStatus:
                        "confirmed",

                    createdAt:
                        new Date().toISOString()

                };


                reservations.push(
                    reservation
                );


                localStorage.setItem(
                    "travelReservations",
                    JSON.stringify(
                        reservations
                    )
                );


                alert(
                    "¡Reserva realizada correctamente!"
                );


                bookingForm.reset();


                selectedDate = null;


                const dateInput =
                    document.getElementById(
                        "selectedDate"
                    );


                if (dateInput) {
                    dateInput.value = "";
                }


                renderCalendar();

                renderMyReservations();

            }
        );

    }


    /* =====================================
       MOSTRAR MIS RESERVAS
       ===================================== */

    function renderMyReservations() {

        const container =
            document.getElementById(
                "myReservations"
            );


        if (!container) return;


        container.innerHTML = "";


        const myReservations =
            reservations.filter(
                reservation =>
                    reservation.userId ===
                    currentUser.id
            );


        if (myReservations.length === 0) {

            container.innerHTML = `
                <div class="reservation-item">
                    <h3>No tienes reservas todavía.</h3>
                    <p>
                        Selecciona una fecha disponible
                        para realizar tu primera reserva.
                    </p>
                </div>
            `;

            return;

        }


        myReservations.forEach(
            reservation => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "reservation-item";


                let statusClass =
                    "pending";

                let statusText =
                    "Pago pendiente";


                if (
                    reservation.paymentStatus ===
                    "paid"
                ) {

                    statusClass =
                        "paid";

                    statusText =
                        "Pagado";

                }


                if (
                    reservation.paymentStatus ===
                    "cancelled"
                ) {

                    statusClass =
                        "cancelled";

                    statusText =
                        "Cancelado";

                }


                item.innerHTML = `

                    <h3>
                        ✈️ ${reservation.destination}
                    </h3>

                    <p>
                        📅 <strong>Fecha:</strong>
                        ${reservation.date}
                    </p>

                    <p>
                        👥 <strong>Personas:</strong>
                        ${reservation.people}
                    </p>

                    <p>
                        💳 <strong>Estado:</strong>
                        <span class="status ${statusClass}">
                            ${statusText}
                        </span>
                    </p>

                    ${
                        reservation.notes
                            ? `
                            <p>
                                📝 <strong>Notas:</strong>
                                ${reservation.notes}
                            </p>
                            `
                            : ""
                    }

                `;


                container.appendChild(item);

            }
        );

    }


    /* =====================================
       CERRAR SESIÓN
       ===================================== */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "currentUser"
                );

                window.location.href =
                    "index.html";

            }
        );

    }


    /* =====================================
       INICIAR
       ===================================== */

    renderCalendar();

    renderMyReservations();

});