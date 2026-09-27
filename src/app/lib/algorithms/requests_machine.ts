export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';

// Interface for making a request
export interface BookRequest {
    id: string;
    userID: string;
    bookTitle: string;
    status: RequestStatus;
}

/**
 * Validates stat transitions using deterministic state changes check.
 * @param currentStatus The status of the book in the database
 * @param action The incoming transition request
 * @returns A valid state RequestStatus
 */
export function transitionRequestStatus(currentStatus: RequestStatus, action: 'APPROVED' | 'REJECTED' | 'RETURN'): RequestStatus {
    switch (currentStatus) {
        case 'PENDING':
            if (action === 'APPROVED') return 'APPROVED';
            if (action === 'REJECTED') return 'REJECTED';
            break;
        case 'APPROVED':
            if (action === 'RETURN') return 'RETURNED';
            break;
        default:
            throw new Error(`Invalid state transition from ${currentStatus} via ${action}`);
    }

    throw new Error(`Action ${action} is not permitted when request is ${currentStatus}`);
}
