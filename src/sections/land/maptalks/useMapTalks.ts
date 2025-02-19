import * as maptalks from "maptalks";
import { useRef, useEffect } from "react";

export function useMaptalks(mapId, options) {
    const mapRef = useRef<maptalks.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = new maptalks.Map(mapId, options);
        }
    }, [mapId, options]);

    return mapRef;
}