// Simple client-side AI mocks for demo purposes
export function chatbotResponse(message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const m = message.toLowerCase()
      let reply = "Sorry, I didn't understand that. Try asking about booking, doctors, or timings."

      if (m.includes('book')) reply = 'I can help you book an appointment — go to Book Appointment or tell me preferred doctor and date.'
      else if (m.includes('available') || m.includes('slot')) reply = 'Available slots are usually 10:00, 10:30, 11:00 and 14:00. Select a date to see actual slots.'
      else if (m.includes('timing') || m.includes('hours')) reply = 'Hospital timings: Mon-Sat 8:00 AM - 8:00 PM.'
      else if (m.includes('report')) reply = 'You can upload a medical report on the Report Summary page for a quick summary.'
      else if (m.includes('hello') || m.includes('hi')) reply = 'Hello! How can I assist you today?'

      resolve({ reply })
    }, 500)
  })
}

export function summarizeText(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowered = (text || '').toLowerCase()
      let summary = 'No meaningful text provided.'
      let recommendation = 'General Medicine'

      if (!text || text.trim().length < 20) {
        summary = 'Uploaded file could not be parsed; please paste text or upload a text-based report.'
      } else {
        // crude summary: first 2 sentences or first 200 chars
        const sentences = text.match(/[^.!?]+[.!?]?/g) || []
        if (sentences.length >= 2) summary = sentences.slice(0,2).join(' ').trim()
        else summary = text.slice(0, 200) + (text.length>200? '...':'')

        if (lowered.includes('chest') || lowered.includes('cardiac') || lowered.includes('angina')) recommendation = 'Cardiology'
        else if (lowered.includes('skin') || lowered.includes('rash')) recommendation = 'Dermatology'
        else if (lowered.includes('headache') || lowered.includes('seizure') || lowered.includes('migraine')) recommendation = 'Neurology'
      }

      resolve({ summary, recommendation })
    }, 700)
  })
}
