# PDF LOADER
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.

# loader = PyPDFLoader("test.pdf")
# documents = loader.load()
# print(documents.page_content)

## WEBBASE LOADER-
# from langchain_community.document_loaders import WebBaseLoader
# from dotenv import load_dotenv
# load_dotenv()
# from langchain_openai import ChatOpenAI
# from langchain_core.prompts import ChatPromptTemplate

# loader = WebBaseLoader("https://www.flipkart.com/apple-macbook-air-m5-2026-m5-16-gb-512-gb-ssd-tahoe-mdhh4hn-a/p/itm5a19d35343c46?pid=COMHZQX48T78QSFH&lid=LSTCOMHZQX48T78QSFHBWJIEQ&marketplace=FLIPKART&q=macbook+air+m5&store=6bo%2Fb5g&srno=s_1_1&otracker=AS_QueryStore_OrganicAutoSuggest_1_7_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_7_na_na_na&fm=organic&iid=edc9ff00-dd98-4bf8-9c4c-f3a808126759.COMHZQX48T78QSFH.SEARCH&ppt=hp&ppn=homepage&ssid=l47w4lg4qo0000001788381748010&qH=63d10def9d97a2d3&ov_redirect=true")
# docs = loader.load()

# question = "What is the product we are talking about?"
# text = docs[0].page_content

# prompt = ChatPromptTemplate.from_template("""
# Answer the question based only on the following text.
# Question: {question}
# Text: {text}
# """)

# llm = ChatOpenAI(
#     model="gpt-4.1-mini",
#     temperature=0
# )

# chain = prompt | llm
# response = chain.invoke({
#     "question": question,
#     "text": text
# })
# print(response.content)
# from dotenv import load_dotenv
# load_dotenv()


