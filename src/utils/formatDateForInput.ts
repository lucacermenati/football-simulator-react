/**
 * Converts an ISO date string (e.g. "2000-05-12T00:00:00.000000Z")
 * into the "YYYY-MM-DD" format required by <input type="date">.
 */
export function formatDateForInput(value: string | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
