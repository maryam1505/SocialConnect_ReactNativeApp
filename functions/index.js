const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/**
 * Generic notification sender
 */
async function sendNotification({ postId, actorId, type }) {
    try {
        /* ##  Fetch post ## */
        const postDoc = await db.collection('posts').doc(postId).get();
        if (!postDoc.exists) return null;

        /* ## Avoid Self notifications ## */
        const postOwnerId = postDoc.data()?.userId;
        if (!postOwnerId || postOwnerId === actorId) return null;

        /* ## Fetch actor (liker, commenter, sharer) ## */
        const actorDoc = await db.collection('users').doc(actorId).get();
        if (!actorDoc.exists) return null;

        const actorName = actorDoc.data()?.username || 'Someone';

        /* ## Fetch post owner token ## */
        const ownerDoc = await db.collection('users').doc(postOwnerId).get();
        if (!ownerDoc.exists) return null;

        const token = ownerDoc.data()?.fcmToken;
        if (!token) return null;

        /* ## Message based on type ## */
        let title, body;
        if (type === 'like') {
            title = 'New Like ❤️';
            body = `${actorName} liked your post!`;
        } else if (type === 'comment') {
            title = 'New Comment 💬';
            body = `${actorName} commented on your post!`;
        } else if (type === 'share') {
            title = 'New Share 🔄';
            body = `${actorName} shared your post!`;
        }

        /* ## Send FCM ## */
        await admin.messaging().send({
            token,
            notification: { title, body },
            data: {
                screen: 'NotificationScreen',
                type,
                postId,
            },
        });

        console.log(` ${type} notification sent to ${postOwnerId}`);
        return null;
    } catch (err) {
        console.error(`Error sending ${type} notification:`, err);
        return null;
    }
}

/**
 * Firestore triggers
 */
exports.sendLikeNotification = functions.firestore
    .document('posts/{postId}/likes/{userId}')
    .onCreate((snap, context) => {
        const { postId, userId } = context.params;
        return sendNotification({ postId, actorId: userId, type: 'like' });
    });

exports.sendCommentNotification = functions.firestore
    .document('posts/{postId}/comments/{commentId}')
    .onCreate((snap, context) => {
        const { postId } = context.params;
        const actorId = snap.data()?.userId;
        return sendNotification({ postId, actorId, type: 'comment' });
    });

exports.sendShareNotification = functions.firestore
    .document('posts/{postId}/shares/{userId}')
    .onCreate((snap, context) => {
        const { postId, userId } = context.params;
        return sendNotification({ postId, actorId: userId, type: 'share' });
    });
