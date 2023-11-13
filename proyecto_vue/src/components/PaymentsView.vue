<template>
    <body>
        <div class="container">
            <div class="utilities-container">
                <div class="filter-and-add">
                    <!-- <select v-model="filter" @change="filterProperties">
              <option value="all">Todas los posts</option>
              <option value="typeA">Garzonier</option>
              <option value="typeB">Departamento</option>
            </select> -->
                    <button class="add-btn" @click="openForm()">
                        <span>Registrar pago</span>
                    </button>
                </div>
                <!-- <div class="search-container">
            <input
              v-model="searchText"
              type="text"
              placeholder="Buscar Propiedad..."
              @input="searchProperties"
            />
          </div> -->
            </div>
        </div>
        <div class="container">
            <div class="announcement-board">
                <div v-for="(payment, index) in payments" :key="index" class="announcement-post">
                    <div class="post-title">{{ payment.concept }}</div>
                    <div class="post-content">
                        <div><b>Amount: </b>{{ payment.amount }} Bs.</div>
                        <div><b>Date: </b>{{ payment.date }} </div>
                        <div class="post-description">{{ payment.detail }}</div>
                        <div><b>From: </b>{{ payment.idUserPays }}</div> <!-- TODO: fetch user name from id -->
                        <div><b>To: </b>{{ payment.idUserReceives }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div id="propertyForm">
            <h1>Registrar pago</h1>
            <form @submit.prevent="newPayment()">
                <input v-model="concept" placeholder="Concepto" type="text" required />
                <input v-model="amount" placeholder="Monto" type="number" required />
                <textarea v-model="detail" rows="4" cols="50" required>
                    Escriba el detalle del pago aqui...
                </textarea>

                <input v-model="date" type="date" required />
                <input v-model="userpays" placeholder="Persona paga" type="text" required /> <!-- TODO: convert from username combobox -->
                <input v-model="userreceives" placeholder="Persona recibe" type="text" required />
                <div class="form-buttons">
                    <input class="submitBtn" type="submit" value="Añadir" />
                    <input class="resetBtn" type="reset" value="Limpiar Campos" />
                    <input class="cancelBtn" type="button" value="Cancelar" @click="closeForm" />
                </div>
            </form>
        </div>

    </body>
</template>

<script>
//import PaymentService from '@/service/PaymentService';
export default {
    data() {
        return {
            payments: [],
            showForm: false,
            concept: "",
            amount: "",
            date: "",
            detail: "",
            userpays: "",
            userreceives: "",

        };
    },
    methods: {
        async fetchPayments() {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/v1/payment/all"
                );
                const data = await response.json();
                console.log(data);
                if (data.responseCode === "PAYM-0000" && data.data) {
                    this.payments = data.data;
                } else {
                    console.error("Error fetching payments:", data.errorMessage);
                }
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            }
        },
        async newPayment() {
            const newPayment = {
                concept: this.concept,
                amount: this.amount,
                date: this.date,
                detail: this.detail,
                idUserPays: this.userpays,
                idUserReceives: this.userreceives,
            };

            try {
                // Realizar una solicitud POST a la API para agregar una nueva propiedad.
                const response = await fetch(
                    "http://localhost:8080/api/v1/payment",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            token: "1", // Tu token se establece aquí
                        },
                        body: JSON.stringify(newPayment),
                    });

                if (response.ok) {
                    const responseData = await response.json();

                    if (responseData.responseCode === "PAYM-0001" && responseData.data) {
                        // Suponiendo que el servidor devuelve la propiedad creada, la agregamos a nuestra lista.
                        this.payments.push(responseData.data);
                    } else {
                        console.error("Error adding payment:", responseData.errorMessage);
                    }
                } else {
                    console.error(
                        "Failed to add payment, server responded with:",
                        response.status
                    );
                }
            } catch (error) {
                console.error("Failed to add payment:", error);
            } finally {
                this.closeForm();
            }
        },
        /* filterProperties() {
            if (this.filter === "all") {
                this.getPayments();
            } else {
                this.$axios
                    .get(`http://localhost:3000/payments?status=${this.filter}`)
                    .then((response) => {
                        this.payments = response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        searchProperties() {
            if (this.searchText === "") {
                this.getPayments();
            } else {
                this.$axios
                    .get(
                        `http://localhost:3000/payments?q=${this.searchText}&_limit=10`
                    )
                    .then((response) => {
                        this.payments = response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }, */
        openForm() {
            document.getElementById("propertyForm").style.display = "block";
        },
        closeForm() {
            document.getElementById("propertyForm").style.display = "none";
        },
    },
    mounted() {
        this.fetchPayments();
    },
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap");


* {
    font-family: "Poppins", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body,
#app {
    height: 100%;
    min-height: 100vh;
    width: 100%;
    min-width: 90vw;
    overflow: hidden;
    background-color: #fea162;
}

div {
    box-sizing: border-box;
}

.container {
    padding: 20px;
    width: 100%;
    margin: 0 auto;
    text-align: center;
}

.utilities-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #63f6ff;
    border-radius: 10px;
    margin-bottom: 20px;
    border: 3px solid #22abb3;
}

.utilities-container button {
    margin-left: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #b36634;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    border: none;
}

.utilities-container button:hover {
    transform: scale(1.1);
}

.utilities-container select {
    padding: 10px;
    border-radius: 5px;
    background-color: #b36634;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    border: none;
}

#propertiesTable {
    width: 100%;
    border-collapse: collapse;
    border: 3px solid #22abb3;
    border-radius: 10px;
    overflow: hidden;
    background-color: #63f6ff;
}

#propertiesTable thead {
    background-color: #22abb3;
    color: #fff;
}

#propertyForm .form-buttons {
    display: flex;
    justify-content: space-between;
}

#propertyForm .form-buttons input {
    padding: 10px;
    border-radius: 5px;
    background-color: #b36634;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    border: none;
}

#propertyForm .form-buttons input:hover {
    transform: scale(1.1);
}

#propertyForm .form-buttons .cancelBtn {
    background-color: #fea162;
}

#propertyForm .form-buttons .cancelBtn:hover {
    background-color: #b36634;
}

#editProperty .form-buttons {
    display: flex;
    justify-content: space-between;
}

#editProperty .form-buttons input {
    padding: 10px;
    border-radius: 5px;
    background-color: #b36634;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    border: none;
}

#editProperty .form-buttons input:hover {
    transform: scale(1.1);
}

#editProperty .form-buttons .cancelBtn {
    background-color: #fea162;
}

#editProperty .form-buttons .cancelBtn:hover {
    background-color: #b36634;
}

.search-container {
    width: 100%;
    text-align: center;
}

.search-container input {
    padding: 10px;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    border: none;
}

.search-container input:hover {
    transform: scale(1.1);
}

.add-btn {
    border-radius: 50px;
    background-color: #fea162;
    border: none;
    color: #fff;
    text-align: center;
    font-size: 20px;
    padding: 10px;
    width: fit-content;
    transition: all 0.5s;
    cursor: pointer;
    margin: 5px;
}

.add-btn span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
}

.add-btn span:after {
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
}

.add-btn:hover {
    background-color: #b36634;
}

.add-btn:hover span:after {
    opacity: 1;
    right: 0;
}

#propertyForm,
#editProperty {
    display: none;
    border: 3px solid #22abb3;
    border-radius: 10px;
    padding: 2em;
    width: 400px;
    text-align: center;
    position: fixed;
    background: #63f6ff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    animation: slide-in 0.5s forwards;
}

@keyframes slide-in {
    from {
        transform: translateY(-100%);
        left: 40%;
        opacity: 0;
    }

    to {
        left: 40%;
        transform: translateY(-50%);
        opacity: 1;
    }
}

#propertyForm h1,
#editProperty h1 {
    margin-bottom: 1em;
    color: #fff;
}

#propertyForm input,
#propertyForm select,
#editProperty input,
#editProperty select {
    margin: 0.8em auto;
    font-family: inherit;
    text-transform: inherit;
    font-size: inherit;

    display: block;
    width: 280px;
    padding: 0.4em;
    border-radius: 5px;
    border: none;
    background-color: #fff;
    color: #000;
    font-weight: bold;
    cursor: pointer;
}

#propertyForm input:hover,
#propertyForm select:hover,
#editProperty input:hover,
#editProperty select:hover {
    transform: scale(1.1);
}

#propertyForm input:focus,
#propertyForm select:focus,
#editProperty input:focus,
#editProperty select:focus {
    outline: none;
    box-shadow: 0 0 5px #22abb3;
}

#propertyForm .form-buttons input:focus,
#editProperty .form-buttons input:focus {
    outline: none;
    box-shadow: 0 0 5px #22abb3;
}

img {
    max-width: 100%;
    height: auto;
}

* {
    font-family: "Poppins", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body,
#app {
    height: 100%;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
    padding: 20px;
    background-color: #fea162;
    width: 100%;
    justify-content: center;
    text-align: center;
}

.announcement-board {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    flex-direction: column;
}

.announcement-post {
    width: 95%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    margin: 10px;

    .post-title {
        text-align: start;
        font-size: 18px;
        font-weight: bold;
    }

    .post-content {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .post-image {
        flex: 1;
        max-width: 10%;
        margin-right: 20px;

        img {
            width: 100%;
            border-radius: 5px;
        }
    }

    .post-description {
        flex: 1;
        font-size: 14px;
        text-align: start;
    }

    &:hover {
        transform: scale(1.05);
    }
}

@media screen and (max-width: 768px) {
    .announcement-post {
        .post-content {
            flex-direction: column;
        }

        .post-image {
            max-width: 100%;
            margin-right: 0;
            margin-bottom: 20px;

            img {
                height: 100%;
            }
        }
    }
}
</style>
