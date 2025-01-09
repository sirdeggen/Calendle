export default function date(req, res) {
    res.json({ date: new Date() })
}
