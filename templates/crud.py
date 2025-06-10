from backend.database import get_connection

def get_parrillas_data():
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    SELECT
        Parrilla,
        BU,
        SUM(POSPPI) AS Total,
        MAX(CASE WHEN Rank_Avg = 1 THEN POSPPI ELSE 0 END) AS Rank1,
        MAX(CASE WHEN Rank_Avg = 2 THEN POSPPI ELSE 0 END) AS Rank2,
        MAX(CASE WHEN Rank_Avg = 3 THEN POSPPI ELSE 0 END) AS Rank3
    FROM POS_PPI
    GROUP BY Parrilla, BU
    ORDER BY Parrilla, BU
    """

    cursor.execute(query)
    rows = cursor.fetchall()

    data_by_parrilla = {}
    for row in rows:
        parrilla = row.Parrilla
        if parrilla not in data_by_parrilla:
            data_by_parrilla[parrilla] = []
        data_by_parrilla[parrilla].append({
            "BU": row.BU,
            "Total": row.Total,
            "Rank1": row.Rank1,
            "Rank2": row.Rank2,
            "Rank3": row.Rank3,
        })

    cursor.close()
    conn.close()
    return data_by_parrilla

