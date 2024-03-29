import { AssetInfo, assetsMap, BASE_ASSET_ID } from '@/constant/assetsMap';
import { useNetworkConnection } from '@/context/NetworkConnectionConfig/useNetworkConnection';
import { irregularToDecimalFormatted } from '@/utils/bnJsFormatter';
import { useBalance } from '@fuel-wallet/react';
import { BN } from 'fuels';
import { useEffect, useMemo, useState } from 'react';


interface UseGetBalanceReturn {
    balance: BN | null 
    assetInfo: AssetInfo
    formatted: string | undefined
    isLoading: boolean
    addressToRequest?: string | undefined
}
    

export function useGetBalance(props?: AssetInfo): UseGetBalanceReturn  {
    const assetInfo = useMemo(() => 
        props?.assetId ? {...props} : assetsMap[BASE_ASSET_ID], [props])
    const {accountConnected, isLoading} = useNetworkConnection()
    const {balance, isFetching} = useBalance({address: accountConnected}) 
    const [formatted, setFormatted] = useState<string | undefined>()
    
    useEffect(() => {
        if (!balance) return

        const formatted = irregularToDecimalFormatted(balance, {
            significantFigures: 4,
            assetInfo
        })

        setFormatted(formatted)
    }, [assetInfo, balance])

    return {balance, assetInfo, formatted, isLoading: isLoading || isFetching}
}