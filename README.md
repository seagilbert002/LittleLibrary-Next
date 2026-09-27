# Little Library (Next.js/TypeScript)

**Capstone Project**
Modernized, full-stack Next.js application implementing software design, security focused algorithms, and relational database controls.

## Project Overview
Little Library is a personal book collection and environmental monitoring system. It provides book collection management, loan request state machines for lending to friends, and real-time environmental telemetry monitoring for temperature and humidity to protect the physical book collection against humidity induced mold.

The repository is the transition away from my legacy Go baseline to a modular TypeScript/Next.js architecture with a standalone Hardware Abstraction Layer telemetry daemon and a PostgresSQL database.

## Capstone Enhancements

### **Category One: Software Design & Engineering**
- **Hardware Abstraction Layer (HAL):** Refactored monolithic thermostat routines into a standalone HAL driver supporting physical I2C sensors and simulated hardware testing section.
- **Asynchronous Telemetry Daemon:** Created a fault-tolerant background polling loop with explicit error handling and exponential backoff retry logic during network interruptions.

### **Category Two: Algorithms & Data Structures**
- **Rolling Average Humidity Filter:** Sliding arraw window queue with a O(1) for eviction, and O(*k*) averaging where k <= number of slots in the array) that smooths sensor noise and filters transient spikes to detect sustained high mold risks.
- **Key Stretching Password Hashing:** O(2^k) hashing loop using a 16 byte random salt and SHA-256 iterations to defend against password attacks.
- **Constant Time Hash Comparisons:** O(*n*) full scan of the hash string algorithm that evaluates every character position regardless of mismatch status, keeping execution duration constant to neutralize timing attacks.
- **Finite State Machine Request Transitions:** Deterministic state machine governing loan states and automating concurrency resolution for competing book requests.

### ***TODO*** **Category Three: Databases & Security:** 

## Tech Stack

- **Frontend Framework:** Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend & API:** Next.js Server Actions/API Routes, Node.js runtime
- **Database:** Raw PostgresSQL (`pg` pool)
- **Telemetry Daemon:** Python 3 (Raspberry Pi/I2C/Adafruit CircuitPython)
- **Testing & Tools:** `ts-node` for algorithm CLI verification
