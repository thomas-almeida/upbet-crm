import sheetsController from "../controllers/sheets-controller.js"
import routinesController from "../controllers/routinesController.js"
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const campaignDB = path.join(__dirname, '..', 'db', 'campaign-data.json')

function loadUsersImpact(campaignDataId) {
    let campaignData = []
    campaignData = JSON.parse(fs.readFileSync(campaignDB, 'utf-8'))

    const selectedCampaignData = campaignData.find((campaignData) => campaignData.id === campaignDataId)
    selectedCampaignData.campaigns.forEach((campaign) => {
        sheetsController.getUsersImpact(campaignDataId, campaign['Campaing ID'])
    })
}

async function loadDeposits(campaignDataId) {
    let campaignData = []
    campaignData = JSON.parse(fs.readFileSync(campaignDB, 'utf-8'))

    const selectedCampaignData = campaignData.find((campaignData) => campaignData.id === campaignDataId)
    selectedCampaignData.campaigns.forEach(async (campaign) => {
        await sheetsController.getDepositsByRange(campaignDataId, campaign['Campaing ID'], 7)
        await sheetsController.getDepositsByRange(campaignDataId, campaign['Campaing ID'], 2)
        await sheetsController.getDepositsByRange(campaignDataId, campaign['Campaing ID'], 1)
    })
}

//loadUsersImpact("inppsm502")
//await sheetsController.getDepositsByRange("inppsm502", "1094772", 1)
await routinesController.updateKPIs("inppsm502","1/2025")