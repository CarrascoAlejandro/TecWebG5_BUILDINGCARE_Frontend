<template>
  <NavigationBar></NavigationBar>
  <div class="contract-app">
    <button @click="openForm" id="newPaymentbtn">
      Registrar Nuevo Contrato
    </button>

    <div class="contract-list">
      <div
        v-for="(contract, index) in paymentReceipts"
        :key="index"
        class="contract"
      >
        <div class="contract-content">
          <div class="property">
            Propiedad: {{ propertyNames[contract.contractProperty] }}
          </div>
          <div class="owner">Propietario: {{ contract.contractOwner }}</div>
          <div class="type">
            Tipo: {{ typeContractNames[contract.contractType] }}
          </div>
          <div class="payed-ammount">
            Monto pagado: {{ contract.contractAmount }}
          </div>
          <div class="date start-date">
            Fecha de inicio: {{ contract.contractSignatureDate }}
          </div>
          <div class="date end-date">
            Fecha de conclusión: {{ contract.contractEndDate }}
          </div>
        </div>
        <div class="actions">
          <button @click="editReceipt(index)">Editar</button>
          <button @click="deleteReceipt(index)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Payment Receipt Form -->
    <div class="receipt-popup" v-if="showReceiptForm">
      <div class="popup-content">
        <form @submit.prevent="editing ? updateReceipt() : createReceipt()">
          <select id="propiedad" v-model="propiedad" required>
            <option value="">Selecciona una propiedad</option>
            <option
              v-for="propiedad in propiedades"
              :key="propiedad.id"
              :value="propiedad.id"
            >
              {{ propiedad.propertyDescription }}
            </option>
          </select>
          <input
            v-model="signatureDate"
            placeholder="Fecha de inicio"
            type="date"
            required
          />
          <input
            v-model="endDate"
            placeholder="Fecha de conclusión"
            type="date"
            required
          />
          <input
            v-model="amount"
            placeholder="Monto pagado"
            type="text"
            required
          />
          <select v-model="type" required>
            <option value="">Seleccione un tipo de contrato:</option>
            <option
              v-for="option in typeContract"
              :key="option.id"
              :value="option.id"
            >
              {{ option.type }}
            </option>
          </select>
          <!-- Action buttons -->
          <div class="form-buttons">
            <button @click="createContract" v-if="!editing">Añadir</button>
            <button @click="updateReceipt(index)" v-if="editing">
              Actualizar
            </button>
            <button @click="deleteReceipt(index)" v-if="editing">
              Eliminar
            </button>
            <button @click="closeForm">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from "./NavigationBar.vue";
import ContractService from "../service/ContractService.js";
import PropertiesService from "../service/PropertiesService.js";
export default {
  data() {
    return {
      propiedades: [],
      typeContract: [],
      paymentReceipts: [],
      showReceiptForm: false,

      propertyNames: {},
      typeContractNames: {},

      propiedad: "",
      signatureDate: "",
      endDate: "",
      amount: "",
      type: "",

      editing: false,
      index: null,

      // contractService: new ContractService(),
      // propertiesService: new PropertiesService(),
      token: 1, //localStorage.getItem("token"),
      contracts: [],
    };
  },
  created() {
    // await this.loadContracts();
    this.contractService = new ContractService();
  },
  async mounted() {
    await this.loadContracts();
  },
  methods: {
    async loadContracts() {
      try {
        const contracts = await this.contractService.getAllContracts(
          this.token
        );
        this.paymentReceipts = contracts;
        // const prop = await this.contractService.getProperties(this.token);
        const prop = await PropertiesService.fetchProperties();
        this.propiedades = prop.data;
        console.log("propiedades: " + JSON.stringify(this.propiedades));

        const typeC = await this.contractService.getTypeContract(this.token);
        this.typeContract = typeC;
        console.log("tipos: " + JSON.stringify(this.typeContract));

        // Cargar los nombres de todas las propiedades únicas en los contratos
        const propertyIds = [
          ...new Set(contracts.map((c) => c.contractProperty)),
        ];
        await Promise.all(propertyIds.map((id) => this.fetchPropertyName(id)));

        // Cargar los nombres de todos los tipos de contrato únicos en los contratos
        const typeContractIds = [
          ...new Set(contracts.map((c) => c.contractType)),
        ];
        await Promise.all(
          typeContractIds.map((id) => this.fetchTypeContractName(id))
        );
      } catch (error) {
        console.error("Error al cargar contratos:", error);
      }
    },
    async createContract() {
      try {
        const newContract = {
          signatureDate: this.signatureDate,
          endDate: this.endDate,
          amount: parseFloat(this.amount),
          idProperty: parseInt(this.propiedad),
          idType: parseInt(this.type),
        };
        // console.log("datos: "+newContract.signatureDate+" "+newContract.endDate+" "+newContract.amount+" "+newContract.idProperty+" "+newContract.idType);
        const data = await this.contractService.createContract(
          newContract,
          this.token
        );
        // const data = await this.contractService.createContract(this.signatureDate,this.endDate,parseInt(this.amount),(this.propiedad),(this.type), this.token);
        // console.log("data: "+JSON.stringify(data)+" result "+JSON.stringify(data.responseCode));
        console.log("code: " + JSON.stringify(data.responseCode));
        await this.loadContracts(); // Recargar lista después de añadir
        this.closeForm();
      } catch (error) {
        console.error("Error al crear contrato:", error);
      }
    },
    async createReceipt() {
      await this.loadContracts(); // Recargar lista después de añadir
      this.closeForm();
    },
    async updateReceipt(index) {
      try {
        const updateContract = {
          signatureDate: this.signatureDate,
          endDate: this.endDate,
          amount: parseFloat(this.amount),
          idProperty: parseInt(this.propiedad),
          idType: parseInt(this.type),
        };
        // console.log("datos: "+newContract.signatureDate+" "+newContract.endDate+" "+newContract.amount+" "+newContract.idProperty+" "+newContract.idType);
        const data = await this.contractService.updateContract(
          this.paymentReceipts[index].id,
          updateContract,
          this.token
        );
        // const data = await this.contractService.createContract(this.signatureDate,this.endDate,parseInt(this.amount),(this.propiedad),(this.type), this.token);
        // console.log("data: "+JSON.stringify(data)+" result "+JSON.stringify(data.responseCode));
        console.log("code: " + JSON.stringify(data.responseCode));
        await this.loadContracts(); // Recargar lista después de actualizar
        this.closeForm();
      } catch (error) {
        console.error("Error al actualizar contrato:", error);
      }
    },

    async deleteReceipt(index) {
      this.closeForm();
      const contractId = this.paymentReceipts[index].id;
      try {
        await this.contractService.deleteContract(contractId, this.token);
        await this.loadContracts(); // Recargar lista después de eliminar
      } catch (error) {
        console.error("Error al eliminar contrato:", error);
      }
    },
    openForm() {
      this.propiedad = "";
      this.signatureDate = "";
      (this.endDate = ""),
        (this.amount = ""),
        (this.type = ""),
        (this.editing = false);
      this.showReceiptForm = true;
    },
    closeForm() {
      this.showReceiptForm = false;
      this.clearForm();
    },
    clearForm() {
      this.propiedad = "";
      this.signatureDate = "";
      (this.endDate = ""), (this.amount = ""), (this.type = "");
    },
    async editReceipt(index) {
      try {
        const contracts = await this.contractService.getContractById(
          this.paymentReceipts[index].id,
          this.token
        );
        const contract = contracts.data;
        console.log("contract: " + JSON.stringify(contract));
        this.propiedad = contract.contractProperty;
        this.signatureDate = contract.contractSignatureDate;
        this.endDate = contract.contractEndDate;
        this.amount = contract.contractAmount;
        this.type = contract.contractType;
        this.editing = true;
        this.showReceiptForm = true;
        this.index = index;
      } catch (error) {
        console.error("Error al obtener contrato:", error);
      }
    },
    async fetchPropertyName(propertyId) {
      try {
        const response = await this.contractService.getPropertyById(
          propertyId,
          this.token
        );
        console.log("response: " + JSON.stringify(response));
        const propertyName = response.data.propertyDescription; // Ajusta esto según tu respuesta real
        console.log("propertyName: " + propertyName);
        // Aquí actualizamos el objeto de propiedades
        // Vue debería ser capaz de detectar este cambio sin necesidad de usar $set
        this.propertyNames[propertyId] = propertyName;
      } catch (error) {
        console.error("Error al obtener el nombre de la propiedad:", error);
      }
    },
    //getTypeContractById
    async fetchTypeContractName(typeContractId) {
      try {
        const response = await this.contractService.getTypeContractById(
          typeContractId,
          this.token
        );
        console.log("response: " + JSON.stringify(response));
        console.log("response data: " + JSON.stringify(response.data.type));
        const typeContractName = response.data.type; // Ajusta esto según tu respuesta real
        console.log("typeContractName!: " + typeContractName);
        // Aquí actualizamos el objeto de propiedades
        // Vue debería ser capaz de detectar este cambio sin necesidad de usar $set
        this.typeContractNames[typeContractId] = typeContractName;
      } catch (error) {
        console.error(
          "Error al obtener el nombre del tipo de contrato:",
          error
        );
      }
    },
  },
  components: { NavigationBar },
};
</script>

<style lang="scss" scoped>
/* Import Google Font Poppins */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

/* Apply Poppins font family to the entire app */
.contract-app {
  background-color: #f2f1e4;
  font-family: "Poppins", sans-serif;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 20px;
  margin-top: 1rem;
}

/* Style the container for the list of payment cards */
.contract-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

/* Style individual payment card */
.contract {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fffaf1;
  min-width: 30%;
  min-height: 100%;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.5s ease-in-out;
  border: 3px solid #a69b8d;
  color: #101e26;
}
.contract:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  scale: 1.05;
  transition: all 0.5s ease-in-out;
}

.contract-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  justify-content: space-between;
  align-items: start;
  flex-direction: column;
  font-weight: 500;
  font-size: 18px;
  padding: 10px;
  /* Your styles for the header and card details */
}
/* Style the details section of the payment card */

/* Style the actions section (buttons) on the payment card */
.actions button {
  margin: 5px;
  padding: 8px 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #498c79;
  color: #101e26;

  &:hover {
    color: #f2d1b3;
    transform: scale(1.05);
    transition: all 0.5s ease-in-out;
  }
}

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
  z-index: 100;
  /* Posición por encima de todo */
  background: rgba(0, 0, 0, 0.5);

  /* Fondo semi-transparente para resaltar el formulario */

  .popup-content {
    background: #f2f1e4;
    border: #a69b8d 5px solid;
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

      input,
      select {
        margin-bottom: 15px;
        padding: 10px;
        border: 2px solid #a69b8d;
        border-radius: 10px;
        width: 100%;
        background-color: #fffaf1;
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
      }
    }
  }
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #498c79;
  color: #101e26;

  &:hover {
    color: #f2d1b3;
    transform: scale(1.05);
    transition: all 0.5s ease-in-out;
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
