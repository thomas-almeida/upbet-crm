import sheetsController from "../controllers/sheets-controller.js"
import routinesController from "../controllers/routinesController.js"

async function loadUsersImpactData() {

    // Atualizar todos os clientes impactados do mes 01
    console.log('Atualizando Clientes Impactados')

    await sheetsController.getUsersImpact('inppsm502', '1087447')
    await sheetsController.getUsersImpact('inppsm502', '1087421')
    await sheetsController.getUsersImpact('inppsm502', '1087409')
    await sheetsController.getUsersImpact('inppsm502', '1087356')
    await sheetsController.getUsersImpact('inppsm502', '1087297')
    await sheetsController.getUsersImpact('inppsm502', '1087204')
    await sheetsController.getUsersImpact('inppsm502', '1087753')
    await sheetsController.getUsersImpact('inppsm502', '1088924')
    await sheetsController.getUsersImpact('inppsm502', '1089241')
    await sheetsController.getUsersImpact('inppsm502', '1089247')
    await sheetsController.getUsersImpact('inppsm502', '1090428')
    await sheetsController.getUsersImpact('inppsm502', '1091136')
    await sheetsController.getUsersImpact('inppsm502', '1094772')
    await sheetsController.getUsersImpact('inppsm502', '1094779')
    await sheetsController.getUsersImpact('inppsm502', '1094789')
    await sheetsController.getUsersImpact('inppsm502', '1094796')
    await sheetsController.getUsersImpact('inppsm502', '1094803')
    await sheetsController.getUsersImpact('inppsm502', '1094811')
    await sheetsController.getUsersImpact('inppsm502', '1094786')
    await sheetsController.getUsersImpact('inppsm502', '1094844')
}

async function loadDeposits() {

    await sheetsController.getDepositsByRange('inppsm502', '1094844', 1)
    //await sheetsController.getDepositsByRange('inppsm502', '1094779', 2)
    //await sheetsController.getDepositsByRange('inppsm502', '1094779', 3)

}

async function loadSheetData() {
    await loadUsersImpactData()
    await loadDeposits()
}

async function updateAllKPIs() {
    await routinesController.updateKPIs('inppsm502', '1/2025')
}

//loadSheetData()
updateAllKPIs()