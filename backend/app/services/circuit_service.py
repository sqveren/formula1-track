import json
import unicodedata
from pathlib import Path

from app.schemas.race import Circuit
from app.services import jolpica_service

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "circuits.json"


async def get_circuits() -> list[Circuit]:
    calendar = await jolpica_service.get_calendar()
    circuit_data = _load_circuit_data()

    return [
        _map_circuit(race, circuit_data.get(_normalize_name(race.circuitName), {}))
        for race in calendar
    ]


async def get_circuit(circuit_name: str) -> Circuit:
    circuits = await get_circuits()
    normalized_name = _normalize_name(circuit_name)

    for circuit in circuits:
        if _normalize_name(circuit.circuitName) == normalized_name:
            return circuit

    return Circuit(
        round=0,
        grandPrixName="Not available yet",
        circuitName=circuit_name,
        country="Not available yet",
        raceDate="Not available yet",
        trackLength="Not available yet",
        numberOfLaps=0,
        raceDistance="Not available yet",
        firstGrandPrixYear=0,
    )


def _load_circuit_data() -> dict[str, dict]:
    with DATA_PATH.open(encoding="utf-8") as file:
        circuits = json.load(file)

    return {
        _normalize_name(circuit.get("circuitName", "")): circuit
        for circuit in circuits
    }


def _map_circuit(race, details: dict) -> Circuit:
    return Circuit(
        round=race.round,
        grandPrixName=race.grandPrixName,
        circuitName=race.circuitName,
        country=race.country,
        raceDate=race.raceDate,
        trackLength=details.get("trackLength", "Not available yet"),
        numberOfLaps=details.get("numberOfLaps", 0),
        raceDistance=details.get("raceDistance", "Not available yet"),
        firstGrandPrixYear=details.get("firstGrandPrixYear", 0),
    )


def _normalize_name(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")

    return ascii_value.casefold()
