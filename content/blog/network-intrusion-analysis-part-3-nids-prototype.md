---
title: "Network Intrusion Analysis - Part 3: NIDS Prototype"
description: >-
  Developing a network intrusion detection system (NIDS) prototype that utilizes
  data manipulation techniques to analyze network traffic and identify potential
  security threats
coverImage: "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIDt78rsjsYhkfI6NLuTq8P4UScnOtFHQpV3EZ"
tags:
  - network
  - intrusion
  - detection
  - nids
  - port-scanning
  - syn-flood
postOfTheDay: true
date: "2025-03-21T13:20:22.640Z"
---

<p align="center"><img src="https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIDt78rsjsYhkfI6NLuTq8P4UScnOtFHQpV3EZ" alt="Three WSL instances: NIDS, Attacker 1 (port scanning), and Attacker 2 (SYN flood)" class="rounded-md" /></p>

<div class="flex justify-center mb-20">
  <span class="text-sm text-center text-white/70"><em>Simulating a NIDS facing two attacks: port scanning and syn flood</em></span>
</div>

A Network Intrusion Detection System (NIDS) monitors network traffic to detect suspicious activities or security policy violations. Think of it as a digital security guard that watches data packets flowing through the network, looking for signs of potential threats like attacks or unauthorized access.

For our prototype, we’ll focus on demonstrating this concept with a simple, yet functional system.

---

## Assignment Breakdown

Our task is to:

- **Develop a prototype**: It doesn’t need to be a full production system—just a working model to show the idea.
- **Use data manipulation techniques**: This means processing network traffic data (e.g., packets) to extract and analyze patterns that could indicate threats.
- **Identify security threats**: We’ll target specific, detectable attack types to keep it doable.

---

## Approach

We’ll build the NIDS prototype in `Python` using the `Scapy` library, which is perfect for capturing, parsing, and analyzing network packets programmatically. The prototype will focus on detecting two common types of attacks using signature-based detection (looking for known malicious patterns):

1. **Port Scans**: When an attacker probes many ports on a target to find vulnerabilities.
2. **SYN Flood Attacks**: When an attacker floods a target with TCP SYN packets to overwhelm it.

Here’s how we’ll tackle it:

### 1. Packet Capture

- Use Scapy’s `sniff` function to capture TCP packets in real-time.
- For testing, we’ll use the loopback interface (`lo`) so anyone can demo it on their own machine without needing a live network.

### 2. Data Manipulation

- Parse each packet to extract key details: source IP, destination IP, destination port, and TCP flags.
- Use dictionaries to track patterns over time:
  - For port scans: Count unique ports per source-destination pair.
  - For SYN floods: Count SYN packets per destination IP-port pair.
- Implement a time window (e.g., 60 seconds) to analyze recent traffic only, cleaning up old data as we go.

### 3. Threat Detection

- **Port Scan**: Flag if a source IP tries more than 10 unique ports on a destination IP within 60 seconds.
- **SYN Flood**: Flag if a destination IP and port receive more than 100 SYN packets in 60 seconds.

### 4. Alerting

- Print alerts to the console with details of the detected threat (e.g., IPs involved, number of ports or packets).

---

## Implementation

First, ensure we have `pip` installed. Let's run:

```bash
sudo apt -y update && sudo apt -y upgrade && sudo apt install -y python3-pip

```

Next, below is the complete Python script for our NIDS prototype. Copy paste and save it as `nids_prototype.py` and run it with `sudo` (since packet sniffing often requires elevated privileges).

```python
from scapy.all import *
import time

# Configuration
TIME_WINDOW = 60  # Time window in seconds
PORT_THRESHOLD = 10  # Max unique ports before flagging a port scan
SYN_THRESHOLD = 100  # Max SYN packets before flagging a SYN flood

# Data structures to track traffic
scan_attempts = {}  # Key: (src_ip, dst_ip), Value: list of (port, timestamp)
syn_counts = {}     # Key: (dst_ip, dst_port), Value: list of timestamps

def packet_handler(packet):
    """
    Process each captured packet to detect port scans and SYN floods.
    """
    if packet.haslayer(TCP) and packet.haslayer(IP):
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        dst_port = packet[TCP].dport
        current_time = time.time()

        # --- Port Scan Detection ---
        key = (src_ip, dst_ip)
        if key not in scan_attempts:
            scan_attempts[key] = []
        # Add current port with timestamp
        scan_attempts[key].append((dst_port, current_time))
        # Remove entries older than TIME_WINDOW
        scan_attempts[key] = [entry for entry in scan_attempts[key]
                             if current_time - entry[1] <= TIME_WINDOW]
        # Count unique ports in the window
        unique_ports = set(entry[0] for entry in scan_attempts[key])
        if len(unique_ports) > PORT_THRESHOLD:
            print(f"Potential port scan from {src_ip} to {dst_ip}: "
                  f"{len(unique_ports)} ports scanned")
            scan_attempts[key] = []  # Reset after alert

        # --- SYN Flood Detection ---
        if packet[TCP].flags == 'S':  # Check for SYN flag
            syn_key = (dst_ip, dst_port)
            if syn_key not in syn_counts:
                syn_counts[syn_key] = []
            # Add SYN packet timestamp
            syn_counts[syn_key].append(current_time)
            # Remove old timestamps
            syn_counts[syn_key] = [ts for ts in syn_counts[syn_key]
                                  if current_time - ts <= TIME_WINDOW]
            if len(syn_counts[syn_key]) > SYN_THRESHOLD:
                print(f"Potential SYN flood to {dst_ip}:{dst_port}: "
                      f"{len(syn_counts[syn_key])} SYN packets")
                syn_counts[syn_key] = []  # Reset after alert

# Start capturing packets on the loopback interface
print("Starting NIDS prototype... Press Ctrl+C to stop.")
sniff(iface="lo", filter="tcp", prn=packet_handler)
```

### Prerequisites

- **Install Scapy globally in the Python environment**: Run `sudo python3 -m pip install scapy` in the terminal.
- **Run with Permissions**: On Linux/Mac, use `sudo python3 nids_prototype.py` because sniffing requires root access. On Windows, it might be needed to adjust permissions or use a tool like `npcap`.

---

## Demo

To make our prototype up and running, we'll need to generate some “malicious” traffic. Here are two simple scripts to simulate the attacks. Run them in separate terminal windows while the NIDS is active.

### 1. Port Scan

Save this as `port_scan.py` and run with `sudo python3 port_scan.py`. It sends SYN packets to ports 1–14 on `127.0.0.1`, triggering the port scan alert after 11 packets (since the threshold is 10).

```python
from scapy.all import *
import time

target_ip = "127.0.0.1"

for port in range(1, 15):
    send(IP(dst=target_ip)/TCP(dport=port, flags="S"), verbose=0)
    time.sleep(0.1)  # Small delay to avoid overwhelming

print("Port scan simulation complete.")
```

### 2. SYN Flood

Save this as `syn_flood.py` and run with `sudo python3 syn_flood.py`. It sends 150 SYN packets to port 80 on `127.0.0.1`, triggering the SYN flood alert after 101 packets (since the threshold is 100).

```python
from scapy.all import *
import time

target_ip = "127.0.0.1"
target_port = 80

for i in range(150):
    send(IP(dst=target_ip)/TCP(dport=target_port, flags="S"), verbose=0)
    time.sleep(0.01)  # Small delay

print("SYN flood simulation complete.")
```

### Demo Steps

1. Start the NIDS: `sudo python3 nids_prototype.py`
2. In another terminal, run the port scan script: `sudo python3 port_scan.py`

- Watch for the “Potential port scan” alert after 11 unique ports.

3. In a third terminal, run the SYN flood script: `sudo python3 syn_flood.py`

- Watch for the “Potential SYN flood” alert after 101 SYN packets.

4. Stop the NIDS with Ctrl+C when done.

---

## Meeting Requirements

- **Data Manipulation Techniques:** The prototype parses packets, extracts features (IPs, ports, flags), and uses dictionaries to track and analyze traffic patterns over time—classic data manipulation in action.
- **Analyzes Network Traffic:** It processes live TCP packets to identify suspicious behavior.
- **Identifies Security Threats:** Detects port scans and SYN floods based on predefined signatures.

---

## Conclusion

Through this experimentation, we successfully demonstrated the application of data manipulation techniques to analyze network traffic and identify potential security threats. By providing a foundation for further development, this prototype can be expanded to include more advanced detection methods and features.

---

## References

- <a href="https://github.com/wemilabs/nids-prototype" target="_blank">GitHub Resources</a> - NIDS Prototype GitHub

---

## Credits

- **Dr BUGINGO Emmanuel**, our lecturer who allowed us to develop this prototype
- **Alain MUGISHA**, Group 12 member
- <a href="https://cuttypiedev.vercel.app/about" target="_blank">Matheo OKISSI</a>, Group 12 member
