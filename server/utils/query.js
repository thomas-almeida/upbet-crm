
function usrs_by_campaign_id(campaignId) {
    return `
    SELECT DISTINCT 
	    c.user_ext_id
    FROM dwh_ext_12023.dm_audience as a
    INNER JOIN
	    dwh_ext_12023.dm_segment as s
	    ON a.segment_id = s.segment_id 
    INNER JOIN
	    dwh_ext_12023.j_communication as c
	    ON a.audience_id = c.root_audience_id 
    WHERE a.audience_id = ${campaignId}`
}

function mails_by_campaign_id(campaignId, factTypeId) {
    return `
    SELECT 
	    COUNT(DISTINCT c.user_ext_id) as total
    FROM dwh_ext_12023.j_communication as c
    INNER JOIN
	    dwh_ext_12023.dm_audience as a
	    ON c.root_audience_id = a.audience_id
    INNER JOIN
	    dwh_ext_12023.dm_resource as r
	    ON c.resource_id = r.resource_id
    WHERE c.root_audience_id = ${campaignId}
	    AND r.resource_type_id IN (1)
	    AND c.fact_type_id IN (${factTypeId})`
}

export default {
    usrs_by_campaign_id,
    mails_by_campaign_id
}