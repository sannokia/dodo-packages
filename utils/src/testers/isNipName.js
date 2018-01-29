export default function(nipName) {
  return /^[a-zA-Z0-9\-'àÀâÂäÄáÁéÉèÈêÊëËìíÌîÎïÏòóÒôÔöÖùúÙûÛüÜçÇ’ñß\.@&quot; ]+$/g.test(nipName);
}
