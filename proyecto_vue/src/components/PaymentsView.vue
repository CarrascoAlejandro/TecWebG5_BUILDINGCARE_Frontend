<template>
    <NavigationBar />
    <div class="payment-app">
        <button @click="openForm" id="newPaymentbtn">Nuevo Pago</button>

        <div class="payment-list">
            <div v-for="(receipt, index) in paymentReceipts" :key="index" class="payment-card">
                <div class="payment-content">
                    <div class="payment-header">
                        <div class="payment-concept">Concepto: {{ receipt.concept }}</div>
                        <div class="payment-date">Fecha del Pago: {{ receipt.date }}</div>
                        <div class="payment-amount">Monto: {{ receipt.amount }}</div>
                    </div>
                    <div class="payment-info">
                        <div class="payment-detail">Detalle: {{ receipt.detail }}</div>
                        <div class="payment-buyer">Paga: {{ receipt.nameUserPays }}</div>
                        <div class="payment-seller">Recibe: {{ receipt.nameUserReceives }}</div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Payment Receipt Form -->
        <div class="receipt-popup" v-if="showReceiptForm">
            <div class="popup-content">
                <form @submit.prevent="createReceipt">
                    <input v-model="concept" placeholder="Concepto" type="text" required />
                    <input v-model="date" placeholder="Fecha del Pago" type="date" required />
                    <input v-model="ammount" placeholder="Monto del Pago" type="number" step="0.01" required />
                    <textarea v-model="detail" placeholder="Detalle del Pago" required></textarea>
                    <select v-model="buyer" required>
                        <option value="" disabled selected>Paga</option>
                        <option v-for="user in users" :key="user.idUser" :value="user.idUser">{{ user.name }}</option>
                    </select>
                    <select v-model="seller" required>
                        <option value="" disabled selected>Recibe</option>
                        <option v-for="user in users" :key="user.idUser" :value="user.idUser">{{ user.name }}</option>
                    </select>
                    
                    <!-- Action buttons -->
                    <div class="form-buttons">
                        <button type="submit">Añadir</button>
                        <button @click="closeForm">Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
    
      
<script>
import PaymentService from '../service/PaymentService';
import UserService from '../service/UserService';
import NavigationBar from './NavigationBar.vue';

export default {
    data() {
        return {
            paymentReceipts: [],
            showReceiptForm: false,
            concept: '',
            date: '',
            ammount: '',
            detail: '',
            buyer: '',
            seller: '',
            index: null,
            users: [],
        };
    },
    created() {
        this.paymentService = new PaymentService();
        this.userService = new UserService();
    },
    mounted() {
        this.getReceipts();
        this.listAllUsers();
    },
    methods: {
        listAllUsers() {
            this.userService.listAllUsers()
                .then((response) => {
                    console.log(response.data.data);
                    this.users = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getReceipts() {
            this.paymentService.getPayments()
                .then((response) => {
                    console.log(response.data);
                    this.paymentReceipts = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        newPayment() {
            const amount = this.ammount;
            const date = this.date;
            const concept = this.concept;
            const detail = this.detail;
            const buyer = this.buyer;
            const seller = this.seller;
            this.paymentService.newPayment(amount, date, concept, detail, buyer, seller)
                .then((response) => {
                    console.log(response.data);
                    this.paymentReceipts = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        openForm() {
            this.concept = '';
            this.date = '';
            this.ammount = '';
            this.detail = '';
            this.buyer = '';
            this.seller = '';
            this.editing = false;
            this.showReceiptForm = true;
        },
        closeForm() {
            this.showReceiptForm = false;
            this.clearForm();
        },
        clearForm() {
            this.concept = '';
            this.date = '';
            this.ammount = '';
            this.detail = '';
            this.buyer = '';
            this.seller = '';
        },
        createReceipt() {
            this.newPayment();
            /* this.paymentReceipts.push({
                concept: this.concept,
                date: this.date,
                ammount: this.ammount,
                detail: this.detail,
                buyer: this.buyer,
                seller: this.seller,
            }); */
            this.closeForm();
            //Reload the page
            location.reload();
        },
    },
    components: { NavigationBar }
};
</script>
    
      
<style lang="scss" scoped>
/* Import Google Font Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

/* Apply Poppins font family to the entire app */
.payment-app {
    margin-top: 1.5rem;
    background-color: #F2F1E4;
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    height: 100%;
    flex-direction: column;
}

/* Style the container for the list of payment cards */
.payment-list {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 15px;
}

/* Style individual payment card */
.payment-card {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fffaf1;
    border: 3px solid #A69B8D;
    min-width: 300px;
    padding: 20px;
    margin-bottom: 20px;
    margin: 10px;
    color: #101E26;
}

.payment-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    scale: 1.05;
    transition: all 0.5s ease-in-out;
}

.payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    font-weight: 600;
    font-size: 20px;
    border-bottom: 2px solid #A69B8D;
    padding: 10px;
}

.payment-info {
    display: flex;
    justify-content: space-between;
    align-items: start;
    flex-direction: column;
    font-weight: 450;
    padding: 10px;
}
/* Style the actions section (buttons) on the payment card */


/* Make the form responsive */
/* Estilos para el formulario con aspecto de carta y espaciado entre elementos */
.receipt-popup {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    transition: all 0.5s ease-in-out;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    /* Posición por encima de todo */
    background: rgba(0, 0, 0, 0.5);

    /* Fondo semi-transparente para resaltar el formulario */

    .popup-content {
        background: #F2F1E4;
        border-radius: 10px;
        border: 5px solid #A69B8D;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        /* Ancho máximo del formulario */
        width: 100%;
        text-align: center;

        form {
            display: flex;
            flex-direction: column;

            input,
            textarea,
            select {
                margin-bottom: 15px;
                padding: 10px;
                border: 2px solid #A69B8D;
                border-radius: 5px;
                width: 100%;
                /* Ancho del input descontando el padding */
                font-size: 16px;

                &:last-child {
                    margin-bottom: 0;
                    /* Eliminar margen inferior del último input */
                }
            }

            .form-buttons {
                display: flex;
                justify-content: space-between;

                button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    background-color: #498c79;
                    color: #101E26;

                    &:hover {
                        background-color: #498c79;
                        color: #f2d1b3;
                        transition: all 0.5s ease-in-out;
                        transform: scale(1.05);
                    }
                }
            }
        }
    }
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    background-color: #498c79;
    color: #101E26;

    &:hover {
        background-color: #498c79;
        color: #f2d1b3;
        transition: all 0.5s ease-in-out;
        transform: scale(1.05);
    }
}

/* Media query for responsiveness */
@media (max-width: 768px) {
    .payment-card {
        width: calc(50% - 20px);
    }

}

@media (max-width: 480px) {
    .payment-card {
        width: calc(100% - 20px);
    }
}
</style>