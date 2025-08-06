import { makeStyles } from 'tss-react/mui';

const useAssistantStyles = makeStyles()((theme) => ({
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    border: '1px solid #ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[1],
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    backgroundColor: '#f9f9f9',
  },
  chatInputContainer: {
    display: 'flex',
    borderTop: '1px solid #ddd',
    padding: theme.spacing(1),
    backgroundColor: '#fff',
  },
  chatInput: {
    flex: 1,
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 16,
    outline: 'none',
  },
  sendButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1, 2),
    fontSize: 16,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    border: 'none',
    borderRadius: 4,
  },
  messageBubble: {
    padding: theme.spacing(1),
    borderRadius: 8,
    marginBottom: theme.spacing(1),
    maxWidth: '80%',
    wordWrap: 'break-word',
  },
  userMessage: {
    backgroundColor: '#e0f7fa',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#eeeeee',
    alignSelf: 'flex-start',
  },
}));

export default useAssistantStyles;
