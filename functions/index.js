const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
initializeApp();

// Quando alguém chega ou sai de um lugar, avisa todos os outros do círculo.
exports.notifyEvent = onDocumentCreated('circles/{code}/events/{id}', async (event) => {
  const e = event.data.data();
  const members = await getFirestore().collection(`circles/${event.params.code}/members`).get();
  const tokens = [];
  members.forEach(d => { const t = d.data().token; if (t && d.id !== e.uid) tokens.push(t); });
  if (!tokens.length) return;
  const body = `${e.name} ${e.type} ${e.type === 'chegou' ? 'em' : 'de'} ${e.place}`;
  await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title: 'Círculo', body },
    android: { priority: 'high' },
    apns: { headers: { 'apns-priority': '10' }, payload: { aps: { sound: 'default' } } }
  });
});
