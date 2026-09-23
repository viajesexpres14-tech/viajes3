/* =========================================================
   PANEL ADMINISTRADOR
   GESTIÓN DE VIAJES, PRECIOS, RESERVAS Y USUARIOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       COMPROBAR ADMIN
       ===================================================== */

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    if (currentUser.role !== "admin") {
        window.location.href = "usuario.html";
        return;
    }


    /* =====================================================
       DATOS
       ===================================================== */

    let availability =
        JSON.parse(
            localStorage.getItem("travelAvailability")
        ) || {};

    let reservations =
        JSON.parse(
            localStorage.getItem("travelReservations")
        ) || [];

    let users =
        JSON.parse(
            localStorage.getItem("travelUsers")
        ) || [];

    let selectedAdminDate = null;

    let adminCurrentDate = new Date();


    /* =====================================================
       MESES
       ===================================================== */

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


    /* =====================================================
       FORMATEAR FECHA
       ===================================================== */

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


    function formatDateSpanish(dateString) {

        if (!dateString) {
            return "-";
        }

        const parts =
            dateString.split("-");

        if (parts.length !== 3) {
            return dateString;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }


    function formatMoney(value) {

        return new Intl.NumberFormat(
            "es-CO",
            {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            }
        ).format(
            Number(value) || 0
        );
    }


    /* =====================================================
       GUARDAR DATOS
       ===================================================== */

    function saveAvailability() {

        localStorage.setItem(
            "travelAvailability",
            JSON.stringify(availability)
        );
    }


    function saveReservations() {

        localStorage.setItem(
            "travelReservations",
            JSON.stringify(reservations)
        );
    }


    /* =====================================================
       NORMALIZAR VIAJES ANTIGUOS
       ===================================================== */

    function normalizeAvailability() {

        Object.keys(availability).forEach(
            date => {

                if (
                    availability[date] === true
                ) {

                    availability[date] = {
                        disponible: true,
                        destino: "",
                        precioPorPersona: 0
                    };

                }

                if (
                    availability[date] === false
                ) {

                    availability[date] = {
                        disponible: false,
                        destino: "",
                        precioPorPersona: 0
                    };

                }

            }
        );

        saveAvailability();
    }

    normalizeAvailability();


    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const adminCalendar =
        document.getElementById(
            "adminCalendar"
        );

    const adminCurrentMonth =
        document.getElementById(
            "adminCurrentMonth"
        );

    const selectedDateText =
        document.getElementById(
            "selectedDateText"
        );

    const adminDestination =
        document.getElementById(
            "adminDestination"
        );

    const adminPrice =
        document.getElementById(
            "adminPrice"
        );


    /* =====================================================
       CALENDARIO
       ===================================================== */

    function renderAdminCalendar() {

        if (!adminCalendar) {
            return;
        }

        adminCalendar.innerHTML = "";

        const year =
            adminCurrentDate.getFullYear();

        const month =
            adminCurrentDate.getMonth();

        adminCurrentMonth.textContent =
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

        startingDay =
            startingDay === 0
                ? 6
                : startingDay - 1;


        for (
            let i = 0;
            i < startingDay;
            i++
        ) {

            const empty =
                document.createElement(
                    "div"
                );

            adminCalendar.appendChild(
                empty
            );
        }


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
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "calendar-day";

            button.textContent =
                day;


            const info =
                availability[dateString];


            if (
                info &&
                info.disponible === true
            ) {

                button.classList.add(
                    "open"
                );

            } else {

                button.classList.add(
                    "closed"
                );

            }


            if (
                selectedAdminDate ===
                dateString
            ) {

                button.classList.add(
                    "selected"
                );

            }


            button.addEventListener(
                "click",
                () => {

                    selectedAdminDate =
                        dateString;

                    loadSelectedDate();

                    renderAdminCalendar();

                }
            );


            adminCalendar.appendChild(
                button
            );
        }
    }


    /* =====================================================
       CARGAR INFORMACIÓN DE FECHA
       ===================================================== */

    function loadSelectedDate() {

        if (!selectedAdminDate) {

            if (selectedDateText) {
                selectedDateText.textContent =
                    "Ninguna";
            }

            return;
        }


        if (selectedDateText) {

            selectedDateText.textContent =
                formatDateSpanish(
                    selectedAdminDate
                );
        }


        const info =
            availability[selectedAdminDate];


        if (
            info &&
            typeof info === "object"
        ) {

            adminDestination.value =
                info.destino || "";

            adminPrice.value =
                info.precioPorPersona || "";

        } else {

            adminDestination.value =
                "";

            adminPrice.value =
                "";

        }
    }


    /* =====================================================
       CAMBIAR MES
       ===================================================== */

    const previousMonth =
        document.getElementById(
            "adminPreviousMonth"
        );

    const nextMonth =
        document.getElementById(
            "adminNextMonth"
        );


    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            () => {

                adminCurrentDate.setMonth(
                    adminCurrentDate.getMonth() - 1
                );

                renderAdminCalendar();

            }
        );
    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            () => {

                adminCurrentDate.setMonth(
                    adminCurrentDate.getMonth() + 1
                );

                renderAdminCalendar();

            }
        );
    }


    /* =====================================================
       GUARDAR / EDITAR VIAJE
       ===================================================== */

    const openDateBtn =
        document.getElementById(
            "openDateBtn"
        );


    if (openDateBtn) {

        openDateBtn.addEventListener(
            "click",
            () => {

                if (!selectedAdminDate) {

                    alert(
                        "Selecciona primero una fecha."
                    );

                    return;
                }


                const destino =
                    adminDestination.value.trim();

                const precio =
                    Number(
                        adminPrice.value
                    );


                if (!destino) {

                    alert(
                        "Escribe el destino del viaje."
                    );

                    adminDestination.focus();

                    return;
                }


                if (
                    !precio ||
                    precio <= 0
                ) {

                    alert(
                        "Escribe un precio válido por persona."
                    );

                    adminPrice.focus();

                    return;
                }


                const yaExistia =
                    availability[
                        selectedAdminDate
                    ] &&
                    availability[
                        selectedAdminDate
                    ].disponible === true;


                availability[
                    selectedAdminDate
                ] = {

                    disponible: true,

                    destino: destino,

                    precioPorPersona: precio

                };


                saveAvailability();

                renderAdminCalendar();

                updateStatistics();

                updateTravelStatistics();


                alert(
                    yaExistia
                        ? "El viaje fue actualizado correctamente."
                        : "El viaje fue creado correctamente."
                );

            }
        );
    }


    /* =====================================================
       CERRAR VIAJE
       ===================================================== */

    const closeDateBtn =
        document.getElementById(
            "closeDateBtn"
        );


    if (closeDateBtn) {

        closeDateBtn.addEventListener(
            "click",
            () => {

                if (!selectedAdminDate) {

                    alert(
                        "Selecciona primero una fecha."
                    );

                    return;
                }


                const info =
                    availability[
                        selectedAdminDate
                    ];


                availability[
                    selectedAdminDate
                ] = {

                    disponible: false,

                    destino:
                        info &&
                        info.destino
                            ? info.destino
                            : "",

                    precioPorPersona:
                        info &&
                        info.precioPorPersona
                            ? info.precioPorPersona
                            : 0

                };


                saveAvailability();

                renderAdminCalendar();

                updateStatistics();

                updateTravelStatistics();


                alert(
                    "El viaje fue cerrado."
                );

            }
        );
    }


    /* =====================================================
       ESTADÍSTICAS GENERALES
       ===================================================== */

    function updateStatistics() {

        const totalUsers =
            document.getElementById(
                "totalUsers"
            );

        const totalReservations =
            document.getElementById(
                "totalReservations"
            );

        const paidReservations =
            document.getElementById(
                "paidReservations"
            );

        const availableDates =
            document.getElementById(
                "availableDates"
            );


        const availableCount =
            Object.values(
                availability
            ).filter(
                value =>
                    value &&
                    typeof value === "object" &&
                    value.disponible === true
            ).length;


        const paidCount =
            reservations.filter(
                reservation =>
                    reservation.paymentStatus ===
                    "paid"
            ).length;


        if (totalUsers) {

            totalUsers.textContent =
                users.filter(
                    user =>
                        user.role === "user"
                ).length;
        }


        if (totalReservations) {

            totalReservations.textContent =
                reservations.length;
        }


        if (paidReservations) {

            paidReservations.textContent =
                paidCount;
        }


        if (availableDates) {

            availableDates.textContent =
                availableCount;
        }
    }


    /* =====================================================
       ESTADÍSTICAS DE VIAJES
       ===================================================== */

    function updateTravelStatistics() {

        const statTravelCount =
            document.getElementById(
                "statTravelCount"
            );

        const statPeopleCount =
            document.getElementById(
                "statPeopleCount"
            );

        const statReservationCount =
            document.getElementById(
                "statReservationCount"
            );

        const statIncome =
            document.getElementById(
                "statIncome"
            );


        const activeTrips =
            Object.values(
                availability
            ).filter(
                value =>
                    value &&
                    typeof value === "object" &&
                    value.disponible === true
            );


        const people =
            reservations.reduce(
                (total, reservation) => {

                    if (
                        reservation.reservationStatus ===
                        "cancelled"
                    ) {

                        return total;
                    }

                    return (
                        total +
                        Number(
                            reservation.people
                        || 0)
                    );

                },
                0
            );


        const income =
            reservations.reduce(
                (total, reservation) => {

                    if (
                        reservation.paymentStatus !==
                        "paid"
                    ) {

                        return total;
                    }

                    return (
                        total +
                        Number(
                            reservation.totalPrice
                        || 0)
                    );

                },
                0
            );


        if (statTravelCount) {

            statTravelCount.textContent =
                activeTrips.length;
        }


        if (statPeopleCount) {

            statPeopleCount.textContent =
                people;
        }


        if (statReservationCount) {

            statReservationCount.textContent =
                reservations.length;
        }


        if (statIncome) {

            statIncome.textContent =
                formatMoney(income);
        }
    }


    /* =====================================================
       RESERVAS
       ===================================================== */

    const reservationsTable =
        document.getElementById(
            "reservationsTable"
        );


    function renderReservations() {

        if (!reservationsTable) {
            return;
        }


        reservationsTable.innerHTML = "";


        const searchInput =
            document.getElementById(
                "searchReservations"
            );

        const statusFilter =
            document.getElementById(
                "reservationStatusFilter"
            );


        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const filter =
            statusFilter
                ? statusFilter.value
                : "all";


        const filtered =
            reservations.filter(
                reservation => {

                    const name =
                        String(
                            reservation.userName || ""
                        ).toLowerCase();

                    const email =
                        String(
                            reservation.userEmail || ""
                        ).toLowerCase();

                    const matchesSearch =
                        name.includes(search) ||
                        email.includes(search);


                    let matchesStatus =
                        true;


                    if (
                        filter === "paid"
                    ) {

                        matchesStatus =
                            reservation.paymentStatus ===
                            "paid";
                    }


                    if (
                        filter === "pending"
                    ) {

                        matchesStatus =
                            reservation.paymentStatus ===
                            "pending";
                    }


                    if (
                        filter === "cancelled"
                    ) {

                        matchesStatus =
                            reservation.paymentStatus ===
                            "cancelled";
                    }


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );


        if (filtered.length === 0) {

            reservationsTable.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;">
                        No se encontraron reservas.
                    </td>
                </tr>
            `;

            return;
        }


        filtered.forEach(
            reservation => {

                const row =
                    document.createElement(
                        "tr"
                    );


                let statusText =
                    "Pendiente";

                let statusClass =
                    "pending";


                if (
                    reservation.paymentStatus ===
                    "paid"
                ) {

                    statusText =
                        "Pagado";

                    statusClass =
                        "paid";
                }


                if (
                    reservation.paymentStatus ===
                    "cancelled"
                ) {

                    statusText =
                        "Cancelado";

                    statusClass =
                        "cancelled";
                }


                row.innerHTML = `

                    <td>
                        <strong>
                            ${reservation.userName || "Usuario"}
                        </strong>

                        <br>

                        <small>
                            ${reservation.userEmail || ""}
                        </small>
                    </td>

                    <td>
                        ${reservation.destination || "-"}
                    </td>

                    <td>
                        ${formatDateSpanish(
                            reservation.date
                        )}
                    </td>

                    <td>
                        ${reservation.people || 0}
                    </td>

                    <td>
                        <span class="status ${statusClass}">
                            ${statusText}
                        </span>
                    </td>

                    <td>

                        <button
                            class="btn btn-success"
                            onclick="markAsPaid(${reservation.id})"
                        >
                            ✓ Pagar
                        </button>

                        <button
                            class="btn btn-danger"
                            onclick="cancelReservation(${reservation.id})"
                        >
                            ✕
                        </button>

                        ${
                            reservation.paymentStatus === "cancelled"
                                ? `
                                    <button
                                        class="btn btn-danger"
                                        onclick="deleteCancelledReservation(${reservation.id})"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                  `
                                : ""
                        }

                    </td>
                `;


                reservationsTable.appendChild(
                    row
                );

            }
        );
    }


    /* =====================================================
       MARCAR PAGADO
       ===================================================== */

    window.markAsPaid =
        function (reservationId) {

            const reservation =
                reservations.find(
                    item =>
                        item.id ===
                        reservationId
                );


            if (!reservation) {
                return;
            }


            reservation.paymentStatus =
                "paid";


            saveReservations();

            renderReservations();

            updateStatistics();

            updateTravelStatistics();
        };


    /* =====================================================
       CANCELAR RESERVA
       ===================================================== */

    window.cancelReservation =
        function (reservationId) {

            const reservation =
                reservations.find(
                    item =>
                        item.id ===
                        reservationId
                );


            if (!reservation) {
                return;
            }


            const confirmCancel =
                confirm(
                    "¿Quieres cancelar esta reserva?"
                );


            if (!confirmCancel) {
                return;
            }


            reservation.paymentStatus =
                "cancelled";

            reservation.reservationStatus =
                "cancelled";


            saveReservations();

            renderReservations();

            updateStatistics();

            updateTravelStatistics();
        };


    /* =====================================================
       ELIMINAR RESERVA CANCELADA
       ===================================================== */

    window.deleteCancelledReservation =
        function (reservationId) {

            const reservation =
                reservations.find(
                    item =>
                        item.id ===
                        reservationId
                );


            if (!reservation) {
                return;
            }


            if (
                reservation.paymentStatus !==
                "cancelled"
            ) {
                return;
            }


            const confirmar =
                confirm(
                    "¿Quieres eliminar definitivamente esta reserva cancelada?"
                );


            if (!confirmar) {
                return;
            }


            reservations =
                reservations.filter(
                    item =>
                        item.id !==
                        reservationId
                );


            saveReservations();

            renderReservations();

            updateStatistics();

            updateTravelStatistics();
        };


    /* =====================================================
       BUSCADOR
       ===================================================== */

    const searchReservations =
        document.getElementById(
            "searchReservations"
        );


    if (searchReservations) {

        searchReservations.addEventListener(
            "input",
            renderReservations
        );
    }


    const reservationStatusFilter =
        document.getElementById(
            "reservationStatusFilter"
        );


    if (reservationStatusFilter) {

        reservationStatusFilter.addEventListener(
            "change",
            renderReservations
        );
    }


    /* =====================================================
       USUARIOS
       ===================================================== */

    const usersTable =
        document.getElementById(
            "usersTable"
        );


    function renderUsers() {

    if (!usersTable) {
        return;
    }


    usersTable.innerHTML = "";


    const normalUsers =
        users.filter(
            user =>
                user.role === "user"
        );


    if (normalUsers.length === 0) {

        usersTable.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;">
                    No hay usuarios registrados.
                </td>
            </tr>
        `;

        return;
    }


    normalUsers.forEach(
        user => {

            const row =
                document.createElement(
                    "tr"
                );


            const userReservations =
                reservations.filter(
                    reservation =>
                        reservation.userId ===
                        user.id
                );


            row.innerHTML = `

                <td>
                    ${user.nombre || user.name || "-"}
                </td>

                <td>
                    ${user.email || "-"}
                </td>

                <td>
                    ${user.telefono || user.phone || "-"}
                </td>

                <td>
                    ${userReservations.length}
                </td>

                <td>
                    <button
                        class="btn btn-danger"
                        onclick="deleteUser(${user.id})"
                    >
                        🗑️ Eliminar
                    </button>
                </td>

            `;


            usersTable.appendChild(
                row
            );

        }
    );
}


/* =====================================================
   ELIMINAR USUARIO
   ===================================================== */

window.deleteUser =
    function (userId) {

        const user =
            users.find(
                item =>
                    item.id ===
                    userId
            );


        if (!user) {
            return;
        }


        if (user.role === "admin") {
            return;
        }


        const confirmar =
            confirm(
                "¿Quieres eliminar definitivamente este usuario?"
            );


        if (!confirmar) {
            return;
        }


        users =
            users.filter(
                item =>
                    item.id !==
                    userId
            );


        localStorage.setItem(
            "travelUsers",
            JSON.stringify(users)
        );


        renderUsers();

        updateStatistics();
    };

    /* =====================================================
       CERRAR SESIÓN
       ===================================================== */

    const logout =
        document.getElementById(
            "adminLogoutBtn"
        );


    if (logout) {

        logout.addEventListener(
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


    /* =====================================================
       INICIAR
       ===================================================== */

    renderAdminCalendar();

    renderReservations();

    renderUsers();

    updateStatistics();

    updateTravelStatistics();

});