import requests

VT_API_KEY = "9368a9c03288c1371afaa930cad06a88ed4c03d5474e02246cfde6873a237a14"

def check_domain_virustotal(domain):
    url = f"https://www.virustotal.com/api/v3/domains/{domain}"

    headers = {
        "x-apikey": VT_API_KEY
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code == 200:
            data = response.json()
            stats = data["data"]["attributes"]["last_analysis_stats"]

            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)

            return malicious, suspicious

        elif response.status_code == 404:
            # Domain not found in VirusTotal database
            return 0, 0

        else:
            print("VirusTotal error:", response.status_code)
            return 0, 0

    except Exception as e:
        print("VirusTotal API error:", e)
        return 0, 0
