from io import BytesIO
from cryptography.fernet import Fernet

def encrypt_file(file):
    key = Fernet.generate_key()
    fernet = Fernet(key)
    encrypted_data = fernet.encrypt(file.read())
    
    file.seek(0)
    file.truncate(0)
    file.write(encrypted_data)

    return file, key

def decrypt_file(file, key):
    fernet = Fernet(key)

    # Read the encrypted content from the file object
    file.seek(0)
    encrypted_data = file.read()

    # Decrypt the data
    decrypted_data = fernet.decrypt(encrypted_data)
    
    # Return a file-like object of the decrypted data
    decrypted_instance = BytesIO(decrypted_data)
    decrypted_instance.seek(0)

    return decrypted_instance

