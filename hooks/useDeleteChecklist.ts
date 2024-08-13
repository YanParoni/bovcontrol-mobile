import { useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { useRealm } from '@/context/RealmContext'

const API_URL = 'http://challenge-front-end.bovcontrol.com/v1'

export const useDeleteChecklist = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const realm = useRealm()!

  const deleteChecklistFromAPI = async (checklistId: string) => {
    const response = await fetch(`${API_URL}/checkList/${checklistId}`, {
      method: 'DELETE',
    })

    if (response.status !== 200) {
      throw new Error('Erro ao deletar checklist na API.')
    }
  }

 
  const deleteChecklistFromRealm = (checklistId: string) => {
    realm.write(() => {
      const checklistToDelete = realm.objectForPrimaryKey('Checklist', String(checklistId))
      if (checklistToDelete) {
        realm.delete(checklistToDelete)
      } else {
        throw new Error('Checklist não encontrado no RealmDB.')
      }
    })
  }

  const savePendingDeletionToRealm = (checklistId: string) => {
    realm.write(() => {
      realm.create('PendingDeletion', {
        _id: checklistId,
        isPending: true,
      })
    })
  }

  const handleChecklistDeletion = async (checklistId: string, isConnected: boolean) => {
    if (isConnected) {
      await deleteChecklistFromAPI(checklistId)
    } else {
      savePendingDeletionToRealm(checklistId)
      deleteChecklistFromRealm(checklistId)
    }
  }

  const deleteChecklist = async (checklistId: string) => {
    setLoading(true)
    setError(null)

    const { isConnected } = await NetInfo.fetch()
    try {
      await handleChecklistDeletion(String(checklistId), isConnected!)
    } catch (err) {
      setError(err.message || 'Erro desconhecido')
      console.error('Deletion Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { deleteChecklist, loading, error }
}
