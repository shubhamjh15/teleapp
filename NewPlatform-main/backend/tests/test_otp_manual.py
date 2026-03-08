import requests
import time
import random

BASE_URL = "http://127.0.0.1:8000/api/v1"

# Generate unique identifiers for each test run
RAND_ID = random.randint(1000, 9999)
PHONE = f"+9198665{RAND_ID}"
EMAIL = f"user_{RAND_ID}@example.com"
PASSWORD = "securepassword123"

results = []

def record_result(name, passed, message=""):
    results.append({
        "name": name,
        "passed": passed,
        "message": message
    })

def send_otp(flow, phone=PHONE):
    return requests.post(f"{BASE_URL}/auth/{flow}/send-otp", json={"phone": phone})

def verify_otp(flow, otp, phone=PHONE):
    return requests.post(f"{BASE_URL}/auth/{flow}/verify-otp", json={"phone": phone, "otp": otp})

def signup_password(email, password):
    return requests.post(f"{BASE_URL}/auth/signup/password", json={"email": email, "password": password, "full_name": "Test User"})

def login_password(email, password):
    return requests.post(f"{BASE_URL}/auth/login/password", json={"email": email, "password": password})

if __name__ == "__main__":

    print("\n========== 1. OTP LOGIN FAIL (USER NOT FOUND) ==========")
    try:
        res = send_otp("login", phone=PHONE)
        record_result("OTP LOGIN FAIL (USER NOT FOUND)", res.status_code == 404)
    except Exception as e:
        record_result("OTP LOGIN FAIL (USER NOT FOUND)", False, str(e))

    print("\n========== 2. EMAIL SIGNUP SUCCESS ==========")
    try:
        res = signup_password(EMAIL, PASSWORD)
        data = res.json()
        passed = res.status_code == 201 and "access_token" in data and data.get("role") == "user"
        record_result("EMAIL SIGNUP SUCCESS", passed)
    except Exception as e:
        record_result("EMAIL SIGNUP SUCCESS", False, str(e))

    print("\n========== 3. EMAIL SIGNUP DUPLICATE FAIL ==========")
    try:
        res = signup_password(EMAIL, PASSWORD)
        record_result("EMAIL SIGNUP DUPLICATE FAIL", res.status_code == 400)
    except Exception as e:
        record_result("EMAIL SIGNUP DUPLICATE FAIL", False, str(e))

    print("\n========== 4. EMAIL LOGIN SUCCESS ==========")
    try:
        res = login_password(EMAIL, PASSWORD)
        data = res.json()
        passed = res.status_code == 200 and "access_token" in data
        record_result("EMAIL LOGIN SUCCESS", passed)
    except Exception as e:
        record_result("EMAIL LOGIN SUCCESS", False, str(e))

    print("\n========== 5. EMAIL LOGIN WRONG PASSWORD ==========")
    try:
        res = login_password(EMAIL, "wrong_pass")
        record_result("EMAIL LOGIN WRONG PASSWORD", res.status_code == 401)
    except Exception as e:
        record_result("EMAIL LOGIN WRONG PASSWORD", False, str(e))

    print("\n========== 6. OTP SIGNUP SUCCESS ==========")
    try:
        # Use a new phone for OTP signup test
        SIGNUP_PHONE = f"+11111{RAND_ID}"
        s_res = send_otp("signup", phone=SIGNUP_PHONE)
        otp = s_res.json().get("dev_otp")
        v_res = verify_otp("signup", otp, phone=SIGNUP_PHONE)
        record_result("OTP SIGNUP SUCCESS", v_res.status_code == 200)
    except Exception as e:
        record_result("OTP SIGNUP SUCCESS", False, str(e))

    print("\n========== 7. OTP SIGNUP DUPLICATE FAIL ==========")
    try:
        res = send_otp("signup", phone=SIGNUP_PHONE)
        record_result("OTP SIGNUP DUPLICATE FAIL", res.status_code == 400)
    except Exception as e:
        record_result("OTP SIGNUP DUPLICATE FAIL", False, str(e))

    print("\n========== 8. OTP LOGIN SUCCESS ==========")
    try:
        s_res = send_otp("login", phone=SIGNUP_PHONE)
        otp = s_res.json().get("dev_otp")
        v_res = verify_otp("login", otp, phone=SIGNUP_PHONE)
        record_result("OTP LOGIN SUCCESS", v_res.status_code == 200)
    except Exception as e:
        record_result("OTP LOGIN SUCCESS", False, str(e))

    print("\n========== 9. OTP SECURITY (EXPIRED TEST) ==========")
    try:
        s_res = send_otp("login", phone=SIGNUP_PHONE)
        otp = s_res.json().get("dev_otp")
        print("Waiting 12s for expiration...")
        time.sleep(12)
        v_res = verify_otp("login", otp, phone=SIGNUP_PHONE)
        record_result("OTP SECURITY (EXPIRED TEST)", v_res.status_code == 400)
    except Exception as e:
        record_result("OTP SECURITY (EXPIRED TEST)", False, str(e))

    print("\n================ TEST SUMMARY ================\n")
    passed_count = sum(1 for r in results if r["passed"])
    for r in results:
        status = "PASSED ✅" if r["passed"] else "FAILED ❌"
        print(f"{r['name']}: {status}")
        if not r["passed"] and r["message"]:
            print(f"   Error: {r['message']}")

    print("\n----------------------------------------------")
    print(f"Total Tests: {len(results)} | Passed: {passed_count} | Failed: {len(results) - passed_count}")
    print("----------------------------------------------")

    if passed_count == len(results):
        print("\n🎉 ALL TESTS PASSED 🎉\n")