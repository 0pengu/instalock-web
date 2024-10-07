import os
from dotenv import load_dotenv
from keyring import delete_password, get_password, set_password
import requests

load_dotenv()

URL = os.environ["URL"]


def authentication():
    while True:
        api_key = input(
            f"Go to {URL}, log in, go to settings, and create an API key. Once you have the API key, enter it here: ")

        # if len(api_key) != 1:
        #     print("Invalid API key. Please try again.")
        #     continue

        res = requests.get(
            f"{URL}/api/jwt/check?jwt={api_key}")

        print(res)
        if res.status_code == 200:
            print("API key is valid.")
            return api_key

        print("Invalid API key. Please try again.")


def main():
    jwt = get_password("instalock-desktop", "jwt")

    if os.environ["ENV"] == "development" and jwt:
        delete_password("instalock-desktop", "jwt")

    if jwt is None:
        jwt = authentication()
        set_password("instalock-desktop", "jwt", jwt)


if __name__ == "__main__":
    main()
