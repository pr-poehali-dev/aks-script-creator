"""
Business: Управление сообществом читов - сохранение, получение, голосование, скачивание
Args: event - dict с httpMethod, body/queryStringParameters
      context - object с request_id, function_name
Returns: HTTP response dict
"""
import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            sort_by = params.get('sort_by', 'recent')
            
            order_clause = 'created_at DESC'
            if sort_by == 'popular':
                order_clause = 'likes DESC, created_at DESC'
            elif sort_by == 'downloads':
                order_clause = 'downloads DESC, created_at DESC'
            
            query = f"""
                SELECT 
                    gc.id,
                    gc.cheat_name,
                    gc.activation_code,
                    gc.lua_code,
                    gc.download_link,
                    gc.selected_features,
                    gc.custom_features_count,
                    gc.menu_design,
                    gc.likes,
                    gc.dislikes,
                    gc.downloads,
                    gc.created_at,
                    u.username as creator_name
                FROM t_p99311420_aks_script_creator.generated_cheats gc
                LEFT JOIN t_p99311420_aks_script_creator.users u ON gc.created_by = u.id
                ORDER BY {order_clause}
                LIMIT 100
            """
            
            cursor.execute(query)
            rows = cursor.fetchall()
            
            cheats = []
            for row in rows:
                cheats.append({
                    'id': row[0],
                    'cheat_name': row[1],
                    'activation_code': row[2],
                    'lua_code': row[3],
                    'download_link': row[4],
                    'selected_features': row[5] if row[5] else [],
                    'custom_features_count': row[6],
                    'menu_design': row[7],
                    'likes': row[8],
                    'dislikes': row[9],
                    'downloads': row[10],
                    'created_at': row[11].isoformat() if row[11] else None,
                    'creator_name': row[12]
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'cheats': cheats})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'save':
                cheat_name = body_data.get('cheat_name')
                activation_code = body_data.get('activation_code')
                lua_code = body_data.get('lua_code')
                download_link = body_data.get('download_link')
                selected_features = body_data.get('selected_features', [])
                custom_features_count = body_data.get('custom_features_count', 0)
                menu_design = body_data.get('menu_design', 'classic')
                user_id = body_data.get('user_id')
                
                if not all([cheat_name, activation_code, lua_code, download_link, user_id]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                cursor.execute("""
                    INSERT INTO t_p99311420_aks_script_creator.generated_cheats 
                    (cheat_name, activation_code, lua_code, download_link, selected_features, custom_features_count, menu_design, created_by)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, created_at
                """, (cheat_name, activation_code, lua_code, download_link, selected_features, custom_features_count, menu_design, user_id))
                
                result = cursor.fetchone()
                cheat_id = result[0]
                created_at = result[1].isoformat()
                
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'cheat_id': cheat_id,
                        'created_at': created_at
                    })
                }
            
            elif action == 'vote':
                cheat_id = body_data.get('cheat_id')
                user_id = body_data.get('user_id')
                vote_type = body_data.get('vote_type')
                
                if not all([cheat_id, user_id, vote_type]) or vote_type not in ['like', 'dislike']:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid parameters'})
                    }
                
                cursor.execute("""
                    SELECT vote_type FROM t_p99311420_aks_script_creator.cheat_votes
                    WHERE cheat_id = %s AND user_id = %s
                """, (cheat_id, user_id))
                
                existing_vote = cursor.fetchone()
                
                if existing_vote:
                    old_vote_type = existing_vote[0]
                    
                    if old_vote_type == vote_type:
                        cursor.execute("""
                            DELETE FROM t_p99311420_aks_script_creator.cheat_votes
                            WHERE cheat_id = %s AND user_id = %s
                        """, (cheat_id, user_id))
                        
                        if old_vote_type == 'like':
                            cursor.execute("""
                                UPDATE t_p99311420_aks_script_creator.generated_cheats
                                SET likes = GREATEST(likes - 1, 0)
                                WHERE id = %s
                            """, (cheat_id,))
                        else:
                            cursor.execute("""
                                UPDATE t_p99311420_aks_script_creator.generated_cheats
                                SET dislikes = GREATEST(dislikes - 1, 0)
                                WHERE id = %s
                            """, (cheat_id,))
                        
                        action_result = 'removed'
                    else:
                        cursor.execute("""
                            UPDATE t_p99311420_aks_script_creator.cheat_votes
                            SET vote_type = %s
                            WHERE cheat_id = %s AND user_id = %s
                        """, (vote_type, cheat_id, user_id))
                        
                        if old_vote_type == 'like':
                            cursor.execute("""
                                UPDATE t_p99311420_aks_script_creator.generated_cheats
                                SET likes = GREATEST(likes - 1, 0), dislikes = dislikes + 1
                                WHERE id = %s
                            """, (cheat_id,))
                        else:
                            cursor.execute("""
                                UPDATE t_p99311420_aks_script_creator.generated_cheats
                                SET dislikes = GREATEST(dislikes - 1, 0), likes = likes + 1
                                WHERE id = %s
                            """, (cheat_id,))
                        
                        action_result = 'changed'
                else:
                    cursor.execute("""
                        INSERT INTO t_p99311420_aks_script_creator.cheat_votes (cheat_id, user_id, vote_type)
                        VALUES (%s, %s, %s)
                    """, (cheat_id, user_id, vote_type))
                    
                    if vote_type == 'like':
                        cursor.execute("""
                            UPDATE t_p99311420_aks_script_creator.generated_cheats
                            SET likes = likes + 1
                            WHERE id = %s
                        """, (cheat_id,))
                    else:
                        cursor.execute("""
                            UPDATE t_p99311420_aks_script_creator.generated_cheats
                            SET dislikes = dislikes + 1
                            WHERE id = %s
                        """, (cheat_id,))
                    
                    action_result = 'added'
                
                cursor.execute("""
                    SELECT likes, dislikes FROM t_p99311420_aks_script_creator.generated_cheats
                    WHERE id = %s
                """, (cheat_id,))
                
                result = cursor.fetchone()
                likes = result[0]
                dislikes = result[1]
                
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'action': action_result,
                        'likes': likes,
                        'dislikes': dislikes
                    })
                }
            
            elif action == 'download':
                cheat_id = body_data.get('cheat_id')
                
                if not cheat_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing cheat_id'})
                    }
                
                cursor.execute("""
                    UPDATE t_p99311420_aks_script_creator.generated_cheats
                    SET downloads = downloads + 1
                    WHERE id = %s
                    RETURNING downloads
                """, (cheat_id,))
                
                result = cursor.fetchone()
                if not result:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Cheat not found'})
                    }
                
                downloads = result[0]
                
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'downloads': downloads
                    })
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unknown action'})
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
    except Exception as e:
        if 'conn' in locals():
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
