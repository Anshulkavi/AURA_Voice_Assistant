import speech_recognition as sr
import pyttsx3
import wikipedia
import datetime
import webbrowser
import pywhatkit

# Initialize the speech engine
engine = pyttsx3.init()

# Function to convert text to speech and print it
def respond(text):
    print(f"AI Assistant: {text}")  # Print the response
    engine.say(text)
    engine.runAndWait()

# Function to take voice input from the user
def take_command():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        recognizer.pause_threshold = 0.5
        audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)

    try:
        print("Recognizing...")
        query = recognizer.recognize_google(audio, language='en-in')
        print(f"User said: {query}\n")
    except sr.RequestError:
        respond("Sorry, I'm having trouble connecting to the recognition service.")
        return None
    except sr.UnknownValueError:
        respond("Sorry, I did not catch that. Could you repeat it?")
        return None
    return query.lower()

# Main function to handle commands
def run_assistant():
    respond("How can I assist you today?")
    
    while True:
        command = take_command()
        
        if command is None:
            continue  # Skip the loop if no valid command was captured

        # Handle various commands
        if 'hello' in command:
            respond("Hello! How can I help you?")
        
        elif 'time' in command:
            current_time = datetime.datetime.now().strftime('%H:%M:%S')
            respond(f"The time is {current_time}")
        
        elif 'tell me about yourself' in command:
            respond("I am your voice assistant. I can help you with various tasks such as searching Wikipedia, telling the time, opening websites, and more. Just let me know how I can assist you!")

        elif 'wikipedia' in command:
            respond("Searching Wikipedia...")
            command = command.replace("wikipedia", "")
            try:
                results = wikipedia.summary(command, sentences=1)
                respond(f"According to Wikipedia: {results}")
            except wikipedia.exceptions.DisambiguationError as e:
                respond("The query is too ambiguous. Please be more specific.")
            except Exception:
                respond("Sorry, I couldn't find information on that topic.")

        elif 'who is' in command or 'tell me about' in command:
            person_name = command.replace("who is", "").replace("tell me about", "").strip()
            if person_name:
                respond(f"Searching Wikipedia for {person_name}...")
                try:
                    results = wikipedia.summary(person_name, sentences=1)
                    respond(f"According to Wikipedia: {results}")
                except wikipedia.exceptions.DisambiguationError as e:
                    respond("The query is too ambiguous. Please be more specific.")
                except Exception:
                    respond("Sorry, I couldn't find information on that person.")

        elif 'open youtube' in command:
            respond("Opening YouTube...")
            webbrowser.open("https://www.youtube.com")

        elif 'play' in command:
            play_query = command.replace("play", "").strip()
            if play_query:
                respond(f"Playing {play_query} on YouTube...")
                try:
                    pywhatkit.playonyt(play_query)  # This will play the first video on YouTube
                    respond("Please enjoy the video.")
                except Exception as e:
                    respond("Sorry, something went wrong while trying to play the video.")
                    print(f"Error: {e}")

        elif 'weather' in command:
            respond("Checking the weather...")
            webbrowser.open("https://www.google.com/search?q=weather")
            respond("Please come back to this tab and say 'I'm back' to continue.")

            while True:
                response = take_command()
                if response and 'i\'m back' in response:
                    respond("Welcome back! How can I assist you further?")
                    break

        elif 'google maps' in command:
            respond("Opening Google Maps...")
            webbrowser.open("https://www.google.com/maps")
            respond("Please come back to this tab and say 'I'm back' to continue.")

            while True:
                response = take_command()
                if response and 'i\'m back' in response:
                    respond("Welcome back! How can I assist you further?")
                    break

        elif 'open google' in command:
            respond("Opening Google...")
            webbrowser.open("https://www.google.com")

        elif 'stop' in command or 'bye' in command or 'exit' in command:
            respond("Goodbye! Have a great day!")
            break

        else:
            respond("I'm sorry, I don't understand that command. Could you please try again?")

# Run the assistant
if __name__ == "__main__":
    run_assistant()
