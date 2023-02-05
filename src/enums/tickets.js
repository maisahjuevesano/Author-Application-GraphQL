exports.ticketType = {
    BUG: 'BUG',
    NEW_FEATURE: 'NEW_FEATURE',
    OTHER: 'OTHER'
}

exports.ticketPriority = {
    CRITICAL: 'CRITICAL',
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW'
}

exports.ticketStatus = {
    NEW: 'NEW',
    IN_DEVELOPMENT: 'IN_DEVELOPMENT',
    IN_REVIEW: 'IN_REVIEW',
    READY_FOR_TEST: 'READY_FOR_TEST',
    COMPLETED: 'COMPLETED'
}


//SKapar dessa objekt för att det perfekt matchar hans enum, + att det är en check så att man stavar fel.
//han skriver  också i slutet av listan, tror inte det behövs dock? 