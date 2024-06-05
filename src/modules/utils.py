import os
import pandas as pd
import streamlit as st
from dotenv import load_dotenv
import pdfplumber
import io

from modules.chatbot import Chatbot
from modules.embedder import Embedder

class Utilities:

    @staticmethod
    def load_api_key():
        """
        Loads the OpenAI API key from the .env file or 
        from the user's input and returns it
        """
        load_dotenv()
        user_api_key = os.getenv("OPENAI_API_KEY")
        return user_api_key

    
    @staticmethod
    def handle_upload(file_types):
        """
        Handles and display uploaded_file
        :param file_types: List of accepted file types, e.g., ["csv", "pdf", "txt"]
        """
        pdf_file_path = 'src/modules/ClubInfo.pdf'

        with open(pdf_file_path, 'rb') as file:
            pdf_bytes = file.read()

        uploaded_file = io.BytesIO(pdf_bytes)
        uploaded_file.name = 'ClubInfo.pdf'
        
        if uploaded_file is not None:
            def show_pdf_file(uploaded_file):
                file_container = st.expander("Your PDF file :")
                with pdfplumber.open(uploaded_file) as pdf:
                    pdf_text = ""
                    for page in pdf.pages:
                        pdf_text += page.extract_text() + "\n\n"
                file_container.write(pdf_text)
            
            def get_file_extension(uploaded_file):
                return os.path.splitext(uploaded_file)[1].lower()
            
            file_extension = get_file_extension(uploaded_file.name)

            # Show the contents of the file based on its extension
            if file_extension== ".pdf" : 
                show_pdf_file(uploaded_file)


        else:
            st.session_state["reset_chat"] = True

        #print(uploaded_file)
        return uploaded_file

    @staticmethod
    def setup_chatbot(uploaded_file, model, temperature):
        """
        Sets up the chatbot with the uploaded file, model, and temperature
        """
        embeds = Embedder()

        with st.spinner("Processing..."):
            uploaded_file.seek(0)
            file = uploaded_file.read()
            # Get the document embeddings for the uploaded file
            vectors = embeds.getDocEmbeds(file, uploaded_file.name)

            # Create a Chatbot instance with the specified model and temperature
            chatbot = Chatbot(model, temperature,vectors)
        st.session_state["ready"] = True

        return chatbot


    
