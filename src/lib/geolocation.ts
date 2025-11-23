/**
 * Geolocation utilities for distance calculation and user location
 */

// Get configuration from environment variables
export const GEOLOCATION_CONFIG = {
    DEFAULT_RADIUS_KM: Number(import.meta.env.VITE_DEFAULT_SEARCH_RADIUS_KM) || 50,
    MIN_RADIUS_KM: Number(import.meta.env.VITE_MIN_SEARCH_RADIUS_KM) || 10,
    MAX_RADIUS_KM: Number(import.meta.env.VITE_MAX_SEARCH_RADIUS_KM) || 100,
};

export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(point2.lat - point1.lat);
    const dLng = toRadians(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.lat)) *
        Math.cos(toRadians(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance); // Round to nearest km
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Get user's current location using browser Geolocation API
 * @returns Promise with user's coordinates or null if denied/failed
 */
export async function getUserLocation(): Promise<Coordinates | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser.');
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.warn('Error getting user location:', error.message);
                resolve(null);
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 300000, // Cache for 5 minutes
            }
        );
    });
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted string (e.g., "~15 km")
 */
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return '< 1 km';
    }
    return `~${distanceKm} km`;
}

/**
 * Check if a machine is within the specified radius
 * @param userLocation User's coordinates
 * @param machineLocation Machine's coordinates
 * @param radiusKm Search radius in kilometers
 * @returns True if machine is within radius
 */
export function isWithinRadius(
    userLocation: Coordinates,
    machineLocation: Coordinates,
    radiusKm: number = GEOLOCATION_CONFIG.DEFAULT_RADIUS_KM
): boolean {
    const distance = calculateDistance(userLocation, machineLocation);
    return distance <= radiusKm;
}

/**
 * Sort machines by distance from user location
 * @param machines Array of machines with coordinates
 * @param userLocation User's coordinates
 * @returns Sorted array with distance property added
 */
export function sortByDistance<T extends { location: { coordinates: Coordinates } }>(
    machines: T[],
    userLocation: Coordinates
): (T & { distance: number })[] {
    return machines
        .map((machine) => ({
            ...machine,
            distance: calculateDistance(userLocation, machine.location.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance);
}
