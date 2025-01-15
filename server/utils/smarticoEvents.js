
import axios from "axios"

async function sendClientActionToSmartico(authKey, customerIdsInput, clientAction) {
    // Sanitização e validação dos dados
    clientAction = clientAction.trim();
    const customerIds = customerIdsInput
        .split('\n')
        .map(id => id.trim())
        .filter(id => /^\d{7,10}$/.test(id));

    // Validação de quantidade de IDs
    if (customerIds.length > 100000) {
        return "Limite de 100.000 Customer IDs excedido.";
    }

    const payloads = customerIds.map(customerId => ({
        eid: `event_${Math.random().toString(36).substr(2, 9)}`,
        event_date: Math.floor(Date.now() / 1000) + 30,
        ext_brand_id: "db9b8f68-5cfc-47af-a9fc-df32f46dc43c",
        user_ext_id: customerId,
        event_type: "client_action",
        payload: {
            client_action: clientAction
        }
    }));

    if (payloads.length === 0) {
        return "Nenhum Customer ID válido encontrado.";
    }

    const url = "https://apis3.smartico.ai/api/external/events/v2";

    try {
        const response = await axios.post(url, payloads, {
            headers: {
                Authorization: authKey,
                "Content-Type": "application/json"
            }
        });

        return response.status === 200
            ? "Todos os payloads enviados com sucesso!"
            : `Erro ao enviar payloads: HTTP ${response.status} - ${response.data}`;
    } catch (error) {
        return `Erro ao enviar payloads: ${error.message}`;
    }
}

// Exemplo de uso
(async () => {
    const authKey = "3c62914d-58df-4e93-9082-d11f437a377c";
    const customerIdsInput = "55562642"; // IDs de exemplo separados por nova linha
    const clientAction = "PARTICIPOU_PALPITE";

    const result = await sendClientActionToSmartico(authKey, customerIdsInput, clientAction);
    console.log(result);
})();
