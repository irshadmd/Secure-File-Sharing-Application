from cryptography.fernet import Fernet

def encrypt_file(file):
    key = Fernet.generate_key()
    fernet = Fernet(key)
    encrypted_data = fernet.encrypt(file.read())
    
    file.seek(0)
    file.truncate(0)
    file.write(encrypted_data)

    return file, key

def decrypt_file(file_path, key):
    fernet = Fernet(key)
    with open(file_path, 'rb') as file:
        encrypted_data = file.read()
    decrypted_data = fernet.decrypt(encrypted_data)
    return decrypted_data

