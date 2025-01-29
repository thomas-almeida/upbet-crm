import sheetsController from "../controllers/sheets-controller.js"
import routinesController from "../controllers/routinesController.js"
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const campaignDB = path.join(__dirname, '..', 'db', 'campaign-data.json')

async function loadUsersImpact(campaignDataId) {
    let campaignData = JSON.parse(fs.readFileSync(campaignDB, 'utf-8'));

    const selectedCampaignData = campaignData.find((campaignData) => campaignData.id === campaignDataId);
    if (!selectedCampaignData) {
        console.error(`Campanha principal com ID ${campaignDataId} não encontrada.`);
        return;
    }

    for (const campaign of selectedCampaignData.campaigns) {
        await sheetsController.getUsersImpact(campaignDataId, campaign['Campaing ID']);
    }

    fs.writeFileSync(campaignDB, JSON.stringify(campaignData, null, 2));
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

async function loadMails(campaignDataId) {
    let campaignData = []
    campaignData = JSON.parse(fs.readFileSync(campaignDB, 'utf-8'))

    const selectedCampaignData = campaignData.find((campaignData) => campaignData.id === campaignDataId)
    selectedCampaignData.campaigns.forEach(async (campaign) => {
        await sheetsController.getMailsByCampaignId(campaignDataId, campaign['Campaing ID'], 2)
        await sheetsController.getMailsByCampaignId(campaignDataId, campaign['Campaing ID'], 4)
    })

}

//loadUsersImpact("inppsm502")
//await sheetsController.getMailsByCampaignId("inppsm502", "1087447", 4)
//await sheetsController.getDepositsByRange("inppsm502", "1107347", 1)
//await sheetsController.getDepositsByRange("inppsm502", "1107347", 2)
await routinesController.updateCampaigns("1/2025", "14P77Z0lbIo06JqXFiYyTPaUIV5yjuF41H9G5Nuc2x20", "resumo!A1:Q92", "inppsm502")