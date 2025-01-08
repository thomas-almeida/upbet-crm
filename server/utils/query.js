
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

export default {
    usrs_by_campaign_id
}