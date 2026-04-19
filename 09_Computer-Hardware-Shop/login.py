from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

test_data = [
    ("Amey", "pass@123", "Pass", "TT"),
    ("admin", "Admin321", "Fail", "TF"),
    ("aadd", "admin123", "Fail", "FT"),
    ("xyz", "286", "Fail", "FF")
]

for username, password, expected, case in test_data:
    
    driver.get("http://127.0.0.1:5000")

    if "login" not in driver.current_url.lower():
        driver.get("http://127.0.0.1:5000")

    try:
        user_field = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//input[@type='text' or @type='email']")
        ))
    except:
        print(f"{case} → Username field not found")
        continue

    try:
        pass_field = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//input[@type='password']")
        ))
    except:
        print(f"{case} → Password field not found")
        continue

    user_field.clear()
    pass_field.clear()

  
    user_field.send_keys(username)
    pass_field.send_keys(password)

    try:
        login_btn = driver.find_element(By.XPATH, "//button[@type='submit'] | //input[@type='submit']")
        login_btn.click()
    except:
        print(f"{case} → Login button not found")
        continue

    wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

    page = driver.page_source.lower()

    if expected == "Pass":
        if "/index" in page or "dashboard" in page:
            print(f"{case} → Passed")
        else:
            print(f"{case} → Failed")
    else:
        if "/index" in page or "error" in page or "logout" not in page:
            print(f"{case} → Passed (Error handled)")
        else:
            print(f"{case} → Failed")


driver.quit()