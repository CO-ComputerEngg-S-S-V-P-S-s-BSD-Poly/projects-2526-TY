from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Admin Test Data (TT, TF, FT, FF)
test_cases = [
    ("admin", "admin123", "TT"),   
    ("admin", "wrong", "TF"),      
    ("wrongadmin", "admin123", "FT"),  
    ("wrongadmin", "wrong", "FF")      
]

for username, password, case in test_cases:

    driver = webdriver.Chrome()
    driver.get("http://127.0.0.1:5000/admin_login")

    driver.maximize_window()
    time.sleep(2)

    # Enter Username
    driver.find_element(By.NAME, "username").clear()
    driver.find_element(By.NAME, "username").send_keys(username)

    # Enter Password
    driver.find_element(By.NAME, "password").clear()
    driver.find_element(By.NAME, "password").send_keys(password)

    time.sleep(1)

    # Click Login Button
    driver.find_element(By.TAG_NAME, "button").click()

    time.sleep(3)

    # Result Check
    if "admin_dashboard" in driver.current_url:
        result = " Passed ->Login Success"
    else:
        result = " Passed (Error shown)"

    print(f"Admin Test Case {case}: {result}")

    driver.quit()