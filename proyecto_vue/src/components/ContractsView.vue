<template>
    <body>
        <div class="container">
            <div class="utilities-container">
                <div class="filter-and-add">
                    <button class="add-btn" @click="openForm()">
                        <span>Registrar contrato</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="announcement-board">
                <div v-for="(contract, index) in contracts" :key="index" class="announcement-post">
                    <div class="post-title">{{ contract.contractType }}</div>
                    <div class="post-content">
                        <div><b>Amount: </b>{{ contract.contractAmount }} Bs.</div>
                        <div><b>Start Date: </b>{{ contract.contractSignatureDate }}</div>
                        <div><b>End Date: </b>{{ contract.contractEndDate }}</div>
                        <div><b>Property: </b>{{ contract.contractProperty }}</div>
                        <div><b>User: </b>{{ contract.contractUser }}</div>
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

                <input v-model="date" placeholder="Fecha" type="date" required />
                <input v-model="userpays" placeholder="Persona paga" type="text" required />
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
export default {
    data() {
        return {

            contracts: [
                {
                    contractSignatureDate: "2023-01-15",
                    contractEndDate: "2024-01-14",
                    contractAmount: 1500.50,
                    contractType: "Contrato a plazo fijo",
                    contractProperty: 1,
                    contractUser: 1
                },
            ],

        };
    },
    methods: {
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
    height: 100vh;
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
    // background-color: #63f6ff;
    border-radius: 10px;
    margin-bottom: 20px;
    // border: 3px solid #22abb3;
}

.utilities-container button {
    margin-left: 10px;
    padding: 10px;
    border-radius: 5px;
    // background-color: #b36634;
    background-color: #3489b3;
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
    // background-color: #63f6ff;
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
    // background: #63f6ff;
    background: #9dd8f5;
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
<!-- 63f6ff 
22abb3
#b36634-->
<!-- aqui -->
