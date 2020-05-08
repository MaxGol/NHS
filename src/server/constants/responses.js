export const messages = {
  FIRST_TIME_USER: '🌈 Hello. Welcome to the National Hope Service. We’re trying to keep the spirits of our front-line NHS workers lifted as this pandemic rages on. \n\n❓First up, do you work for the NHS or do you want to send a message of support? \n\nJust type NHS or Support...',

  first_time_public_user_image: 'https://s3-eu-west-1.amazonaws.com/voxly.client.skills/assets/NHS-BOTS/img/welcome_img.png',
  first_time_public_user_greeting: 'Hello and thanks for getting involved and supporting our amazing NHS. \n\nIn 1914, people at home sent letters to their loved ones on the front to keep their spirits up. In 2020, our NHS army needs some of the same love. 💙 \n\nFirst up, I need to confirm your age. Are you over 18?',
  first_time_nhs_user_image: 'https://s3-eu-west-1.amazonaws.com/voxly.client.skills/assets/NHS-BOTS/img/welcome_doc_img.png',
  first_time_nhs_user_greeting: 'Hello you absolute hero! \n\nYou are not alone! 70 million people are standing right behind you.💙 \n\nWe’re so grateful for what you are doing. The sacrifice that you and your families are making has not gone unnoticed. 🌈 \n\nIn this channel you can hear voice Notes from the Nation: short messages of support from the members of the public to keep you going. \n\n🔗Check this link for details on how it works: thenationalhopeservice.com \n\nAre you happy with this, and ready to get going?',

  NHS_INVALID_ANSWER_CONSENT: '🤔 Sorry, I’m not sure I understood you. I need to confirm that you’re keen to use this service. Just type ‘Yes’ or ‘No’ to proceed.',
  PUBLIC_INVALID_ANSWER_CONSENT: '🤔 Sorry, I’m not sure I understood you. Are you happy to continue? Just type ‘Yes’ or ‘No’',

  PROFILE_TYPE_ERROR: 'If you work for the NHS, just type “NHS” to get started. \n\n💙Or, if you want to spread the love and send a voice-note of thanks, type “Support” \n\nEither way, you’re a hero!',
  USER_IS_UNDER_18: 'Ok, thanks for letting us know. Unfortunately this service is not available for those under the age of 18. Team up with an adult if you’d like to get involved, or pass on this opportunity to others who might be interested. Thanks again and stay safe! 💖',
  USER_IS_OVER_18: 'Excellent! Here’s a few more things to consider before we jump in: \n\n🧐Your voice message will be screened by the creators of this service, before sending it over to our NHS heroes. \n\nWe can’t control or stop recipients forwarding on your voice notes to others. But if they are positive messages, hopefully that’s ok. \n\n🔗Check out more details here: thenationalhopeservice.com \n\nAre you happy to continue? Type Yes if you are.',
  USER_AGE_INVALID_ANSWER: '🤔 Sorry, I’m not sure I understood you. Just type ‘Yes’ of you are over 18 or ‘No’ if you are not yet 18.',
  USER_CONSENT_YES: 'Time to send a voice-note and brighten someone’s day! They won\'t be able to respond but trust us, it’s amazingly powerful for our NHS heroes to actually hear you speaking your support. \n\n🙏 Words of wisdom, encouragement or just a simple thank you will all go down a treat! \n\nOver to you...🎤',
  USER_CONSENT_NO: 'No worries, ping us here, if you change your mind. Stay indoors and stay safe.🏠',
  NHS_CONSENT_YES: 'Great! To make sure the messages get to the right place, I need to confirm that you’re working for the NHS. \n\n💌What is your work email? We will send you a 5-digit code to verify your email account (don’t worry, we won’t store it or use it for any other purposes)',
  NHS_CONSENT_NO: 'No worries, ping us here, if you change your mind. Stay safe 🏠',
  audio_message_sent_confirmation_1: 'Thank you 👍 We\'ll make sure the people who really need this get to hear it. Send us another voice note or share this number with others to help us collect as many as possible. ☎️  \n\nIn the meantime, stay indoors and stay safe. 💞🏡',
  audio_message_sent_confirmation_2: 'Keeping all our key workers\' spirits lifted is so important in this time. You\'ll have just helped them feel less alone. ☎️ Please share this number with others to help us keep collecting these lovely messages for the people who need to hear them.',
  audio_message_sent_confirmation_3: 'We might be finding a new normal but our key workers\' will be fighting this battle for long time to come. Knowing that they have your support will mean the world 🌍 Thank you.',
  returning_user_entry: '🌈 Let’s spread the love! Record your voice message for our wonderful NHS staff. \n\nJust like last time: \n\n⏱The notes can be up to 20 seconds long \n\n🚨For medical assistance contact your GP, as you won’t be able to reach the NHS through this platform 💖Keep it positive to lift the spirit of those working hard on the frontline. \n\nOver to you 🎤',
  only_three_per_day: 'Thanks for sharing the love! \n💖We can only accept 3 voice notes a day per person. \nCome back again tomorrow to send another if you’d like to though! 🎤',
  different_file_type: '👀 This looks like something else. \n\n For now, you can only send us voice notes up to 20 seconds long. \n Just hold down the record button and then hit send. \n\nGive it another go! 🎤',
  different_file_type_options: [
    '👀 This looks like something else. \n\n For now, you can only send us voice notes up to 20 seconds long. \n Just hold down the record button and then hit send. \n\nGive it another go! 🎤',
    '👀 Hhmm, we\'re only looking for 20 second voice notes for now. Try that again 🎤',
    '🌈 Send our NHS heroes a real, spoken thank you. Just hold down the record button and then hit send...'
  ]
}

// const messagesddd = {
//   nhs_invalid_answer_consent: '🤔 Sorry, I’m not sure I understood you. I need to confirm that you’re keen to use this service. Just type ‘Yes’ or ‘No’ to proceed.',
//   email_sent_confirmation: 'Thanks! We’ve sent you an email. \n\nWhat is your 5-digit code?',
//   email_error_1: 'Hmm, that doesn\'t look like a valid NHS email address. Try typing that again...',
//   email_error_2: 'Look like that one\'s still not working. You need to have a valid @nhs email. Type it again',
//   email_error_3: 'Sorry, unless you have a valid @nhs email you can\'t access this service',
//   verification_code_valid: '✅ Perfect! We’ve already got a note ready for you...',
//   verification_code_invalid: '❌ This validation code do not much. Please try again.',
//   end_of_registration: 'Hopefully that brightened your day a bit. Whenever you want to hear another one, just send an emoji. Keep going, you are incredible! 🌈',
//   incorrect_message_type: 'At the moment we only accept text messages. Thank you.',
//   NO_RECORDS: 'Unfortunatelly there are no records at the moment. Try another time.'
// }
