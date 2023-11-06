<template>
<div class="payment-app">
    <button @click="openForm" id="newPaymentbtn">Nuevo Pago</button>

    <div class="payment-list">
        <div v-for="(receipt, index) in paymentReceipts" :key="index" class="payment-card">
            <div class="receipt-content">
                <div class="header">
                    <div class="receipt-concept">Concepto: {{ receipt.concept }}</div>
                    <div class="receipt-date">Fecha del Pago: {{ receipt.date }}</div>
                    <div class="receipt-amount">Monto: {{ receipt.ammount }}</div>
                </div>
                <div class="receipt-info">
                    <div class="receipt-detail">Detalle: {{ receipt.detail }}</div>
                    <div class="receipt-buyer">Paga: {{ receipt.buyer }}</div>
                    <div class="receipt-seller">Recibe: {{ receipt.seller }}</div>
                </div>
            </div>
            <div class="receipt-actions">
                <button @click="editReceipt(index)">Editar</button>
                <button @click="deleteReceipt(index)">Borrar</button>
            </div>
        </div>
    </div>

    <!-- Payment Receipt Form -->
    <div class="receipt-popup" v-if="showReceiptForm">
        <div class="popup-content">
            <form>
                <input v-model="concept" placeholder="Concepto" type="text" required />
                <input v-model="date" placeholder="Fecha del Pago" type="date" required />
                <input v-model="ammount" placeholder="Monto del Pago" type="number" step="0.01" required />
                <input v-model="detail" placeholder="Detalle del Pago" type="text" required />
                <input v-model="buyer" placeholder="Paga" type="text" required />
                <input v-model="seller" placeholder="Recibe" type="text" required />
                <!-- Action buttons -->
                <div class="form-buttons">
                    <button @click="createReceipt" v-if="!editing">Añadir</button>
                    <button @click="updateReceipt" v-if="editing">Actualizar</button>
                    <button @click="deleteReceipt(index)" v-if="editing">Borrar</button>
                    <button @click="closeForm">Cerrar</button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

  
<script>
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
            editing: false,
            index: null,
        };
    },
    methods: {
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
            this.paymentReceipts.push({
                concept: this.concept,
                date: this.date,
                ammount: this.ammount,
                detail: this.detail,
                buyer: this.buyer,
                seller: this.seller,

            });
            this.closeForm();
        },
        editReceipt(index) {
            const receipt = this.paymentReceipts[index];
            this.concept = receipt.concept;
            this.date = receipt.date;
            this.ammount = receipt.ammount;
            this.detail = receipt.detail;
            this.buyer = receipt.buyer;
            this.seller = receipt.seller;

            this.editing = true;
            this.showReceiptForm = true;
            this.index = index;
        },
        updateReceipt() {
            this.paymentReceipts[this.index] = {
                concept: this.concept,
                date: this.date,
                ammount: this.ammount,
                detail: this.detail,
                buyer: this.buyer,
                seller: this.seller,

            };
            this.closeForm();
        },
        deleteReceipt(index) {
            this.paymentReceipts.splice(index, 1);
        }
    }
};
</script>

  
<style lang="scss" scoped>
/* Import Google Font Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

/* Apply Poppins font family to the entire app */
.payment-app {
    background-color: #ccc;
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    height: 100vh;
    flex-direction: column;
}

/* Style the container for the list of payment cards */
.payment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}

/* Style individual payment card */
.payment-card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    width: 300px;
    padding: 20px;
    margin-bottom: 20px;
}

.payment-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    scale: 1.01;
    transition: all 0.3s ease-in-out;
}

/* Style the details section of the payment card */
.receipt-details {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    /* Your styles for the header and card details */
}

/* Style the actions section (buttons) on the payment card */
.receipt-actions button {
    margin: 5px;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: blue;
    color: #fff;
}

/* Make the form responsive */
/* Estilos para el formulario con aspecto de carta y espaciado entre elementos */
.receipt-popup {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    transition: all 0.3s ease-in-out;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    /* Posición por encima de todo */
    background: rgba(0, 0, 0, 0.5);
    
    /* Fondo semi-transparente para resaltar el formulario */

    .popup-content {
        background: rgb(247, 247, 247);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        /* Ancho máximo del formulario */
        width: 100%;
        text-align: center;

        form {
            display: flex;
            flex-direction: column;

            input {
                margin-bottom: 15px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                width: calc(100% - 22px);
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

                    &:first-child {
                        background-color: #4c53af;
                        color: white;
                    }

                    &:nth-child(2) {
                        background-color: #0a8bf5;
                        color: white;
                    }

                    &:last-child {
                        background-color: #f44336;
                        color: white;
                    }
                }
            }
        }
    }
}

#newPaymentbtn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
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
