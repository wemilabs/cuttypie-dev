---
title: >-
  Network Intrusion Analysis - Part 1: Simulating and Analyzing an Encrypted Data
  Leak in WSL with Wireshark on Windows
description: >-
  Simulating and Analyzing an Encrypted Data Leak in WSL with Wireshark on
  Windows
coverImage: "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEI72OmxOboQZaXjJq5RdrNBuiwW9ThF46DePCc"
tags:
  - network
  - analysis
  - cybersecurity
  - intrusion
  - simulation
  - assignment
  - demo
  - wsl
  - wireshark
  - data-leak
  - encryption
  - ssl/tls
postOfTheDay: true
date: "2025-03-15T22:34:02.441Z"
---

<p align="center"><img src="https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEI72OmxOboQZaXjJq5RdrNBuiwW9ThF46DePCc" alt="Simulation Environment composed of three bash terminals running on WSL: first is a tcpdump monitor, second is the server, and third is the client (screenshotted from our own lab environment)." class="rounded-md" /></p>

  <div class="flex justify-center mb-20">
    <span class="text-sm text-center text-white/70"><em>Simulation Environment composed of three bash terminals running on WSL: first is a tcpdump monitor, second is the server, and third is the client (screenshotted from our own lab environment).</em></span>
  </div>

<p class="text-white/70 font-bold">Scenario: A company suspects an insider is leaking confidential information via encrypted channels. You are given network traffic logs for analysis.</p>

Here's the case study that has been brought to us. After many trials and errors, we're glad to finally come up with a working simulation of the given situation. Every step of the process has been documented so that you can follow along and might even be able to reproduce the same results on your own.

To perform this analysis, we'll be using `OpenSSL` to set up an SSL/TLS server, generating a large file to represent the data, creating a `Bash script` to send it periodically, capturing the traffic with `tcpdump` in WSL, and analyzing it with `Wireshark` on Windows.

<span class="text-sm text-center text-white/70"><em>Note: This guide assumes you have basic knowledge of Linux commands and network concepts. All code snippets are written in Bash and should be run in a WSL environment or Linux terminal.</em></span>

---

## Step 1: Generate a Self-Signed Certificate for the Server

To enable encrypted communication, we need a self-signed certificate for the SSL/TLS server. OpenSSL will generate this for us.

### Commands

1. Open a terminal in your WSL Ubuntu environment.
2. Run:

```bash
# Generate a self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

### Explanation

- `openssl req`: Initiates the certificate request process.
- `-x509`: Creates a self-signed certificate instead of a request.
- `-newkey rsa:4096`: Generates a 4096-bit RSA private key.
- `-keyout key.pem`: Saves the private key to `key.pem`.
- `-out cert.pem`: Saves the certificate to `cert.pem`.
- `-days 365`: Sets the certificate's validity period to 365 days.
- `-nodes`: Skips adding a passphrase to encrypt the private key (simplifies the setup).

When prompted, press Enter to skip fields like country or organization, or fill them in as desired.

---

## Step 2: Start the SSL/TLS Server

Set up an encrypted server using OpenSSL to listen for incoming connections.

### Commands

1. In the WSL terminal, run:

```bash
# Start the SSL/TLS server
openssl s_server -accept 8443 -cert cert.pem -key key.pem
```

### Explanation

- `openssl s_server`: Launches an SSL/TLS server.
- `-accept 8443`: Listens on port 8443 (a non-standard port to mimic suspicious activity).
- `-cert cert.pem`: Uses the certificate from Step 1.
- `-key key.pem`: Uses the private key from Step 1.

The server will run until you stop it with Ctrl+C.

---

## Step 3: Create a Large File to Simulate Confidential Data

Generate a large file (e.g., 10MB) to represent the confidential data being leaked.

### Commands

1. In the WSL terminal, run:

```bash
# Create a 10MB file
dd if=/dev/urandom of=confidential_data.txt bs=1M count=10
```

### Explanation

- `dd`: A tool for copying and converting data.
- `if=/dev/urandom`: Uses random data as the input source.
- `of=confidential_data.txt`: Outputs to a file named `confidential_data.txt`.
- `bs=1M`: Sets the block size to 1 megabyte.
- `count=10`: Writes 10 blocks, creating a 10MB file.

Adjust `count` to increase or decrease the file size as needed.

---

## Step 4: Create a Bash Script to Simulate Periodic Data Leaks

Write a Bash script to periodically send the large file to the server, simulating an insider leaking data every 5 minutes.

### Commands

1. Open a text editor (e.g., `nano leak.sh`) and add:

```bash
#!/bin/bash

while true; do
    cat confidential_data.txt | openssl s_client -connect localhost:8443 -quiet
    sleep 300  # Wait 5 minutes
done
```

2. Save the file and make it executable:

```bash
# Add execute permissions
chmod +x leak.sh
```

3. Run the script:

```bash
# Run the script
./leak.sh
```

If you don't want to see logs and appears anonymous, you can run the script in the background:

```bash
# Run the script in the background
./leak.sh &
```

### Explanation

- `#!/bin/bash`: Declares the script runs with Bash.
- `while true; do`: Loops indefinitely.
- `cat confidential_data.txt`: Reads the file’s contents.
- `openssl s_client -connect localhost:8443 -quiet`: Connects to the server on localhost:8443 and sends the file over an encrypted connection. -quiet suppresses extra output.
- `sleep 300`: Pauses for 300 seconds (5 minutes).
- `&`: Runs the script in the background, freeing up the terminal.

---

## Step 5: Capture Traffic with `tcpdump` in WSL

Use `tcpdump` to capture the encrypted traffic in WSL, as Wireshark on Windows can’t directly capture WSL’s loopback traffic. Save it to a `.pcap` file.

### Commands

1. Install tcpdump if needed:

```bash
# Install tcpdump
sudo apt update && sudo apt install -y tcpdump
```

2. Capture traffic on the loopback interface:

```bash
# Capture traffic
sudo tcpdump -i lo -w /mnt/c/Users/[YourUsername]/[WhateverChosenFolderPath]/encrypted_traffic_capture.pcap port 8443
```

- We think no need to tell you to replace `[YourUsername]` and `[WhateverChosenFolderPath]` with your actual username and chosen folder path.

### Explanation

- `sudo tcpdump`: Runs `tcpdump` with root privileges (needed for capturing).
- `-i lo`: Targets the loopback interface (`lo`), where the server and client communicate.
- `-w /mnt/c/Users/[YourUsername]/[WhateverChosenFolderPath]/encrypted_traffic_capture.pcap`: Saves the capture to a `.pcap` file in your Windows Documents folder (e.g., `C:\Users\YourUsername\Documents\capture.pcap`).
- `port 8443`: Filters traffic to port 8443 only.

Run `tcpdump` for a while (e.g., 30 minutes to catch two transfers), then stop it with `Ctrl+C`.

---

## Step 6: Analyze the Traffic with Wireshark on Windows

Open the captured `.pcap` file in Wireshark on Windows to analyze the encrypted data leak.

### Steps

1. Launch Wireshark on Windows.
2. Go to `File > Open`.
3. Navigate to `C:\Users\[YourUsername]\[WhateverChosenFolderPath]\encrypted_traffic_capture.pcap` and open it.

### Key Analysis Points

- **Filter Traffic**: Use `tcp.port == 8443` to isolate the server-client communication.
- **Identify Patterns**:
  - Look for periodic large data transfers (every 5 minutes).
  - Note the non-standard port (8443) for SSL/TLS traffic.
  - Check the data volume per transfer.
- **Examine SSL/TLS Details**: Expand the "Secure Sockets Layer" section in packet details to verify encryption and view handshake data.

These observations will help you spot suspicious activity, such as an insider leaking data.

---

## Additional Notes

- **Stopping Everything**:
  - Stop the server with `Ctrl+C`.
  - Stop the script by finding its process ID (`ps aux | grep leak.sh`) and running `kill <PID>`.
- **Permissions**: Use `sudo` if `tcpdump` reports permission errors.
- **File Paths**: Adjust the `tcpdump` save path to match your Windows username and preferred location.

---

## Conclusion

And that's it!🎉Congratulations on successfully completing the entire process.

Make sure to follow the part 2 where we shared <a href="https://cuttypiedev.vercel.app/blog/network-intrusion-analysis-part-2-forensic-strategies-to-trace-leak-s-origin">some strategies to trace the leak origin.</a>

## Credits

- **Dr BUGINGO Emmanuel**, our lecturer who allowed us to develop this prototype
- **Alain MUGISHA**, Group 12 member
- <a href="https://cuttypiedev.vercel.app/about" target="_blank">Matheo OKISSI</a>, Group 12 member
