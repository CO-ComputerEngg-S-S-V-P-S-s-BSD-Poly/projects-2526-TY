from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

# Test data (TT, TF, FT, FF)
test_data = [
    ("admin", "123", "Pass"),   
    ("admin", "321", "Fail"),   
    ("abc", "123", "Fail"),   
    ("xyz", "286", "Fail")    
]

for username, password, expected in test_data:
    driver.get("http://localhost:5000/login")
    driver.maximize_window()

    time.sleep(2)

    driver.find_element(By.NAME, "username").clear()
    driver.find_element(By.NAME, "password").clear()

    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)

    driver.find_element(By.XPATH, "//button[@type='submit']").click()

    time.sleep(2)

    if expected == "Pass":
        if "Logout" in driver.page_source:
            print(f"{username}/{password} → Passed ")
        else:
            print(f"{username}/{password} → Failed ")
    else:
        if "Logout" not in driver.page_source:
            print(f"{username}/{password} → Passed (Error shown) ")
        else:
            print(f"{username}/{password} → Failed ")

driver.quit()
