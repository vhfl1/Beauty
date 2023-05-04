/* 
 * 김동근
 * CartVO
 * WishVO
 */
package kr.co.beauty.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import kr.co.beauty.vo.MyorderVO;
import kr.co.beauty.vo.PointVO;
import kr.co.beauty.vo.WishVO;

@Mapper
@Repository
public interface MyshopDAO {
	
	//myorder
	public List<MyorderVO> 	selectOrderList			 (@Param("uid") String uid);
	public List<MyorderVO> 	selectOrderListSearchDate(@Param("uid") String uid, @Param("start") String start, @Param("end") String end, @Param("pg") int pg);
	public int				countOrderList			 (@Param("uid") String uid, @Param("start") String start, @Param("end") String end);
	public int				orderConfirm			 (@Param("ordNo") int ordNo);
	
	//point
	public List<PointVO> selectSavePointListSearchDate  (@Param("uid") String uid, @Param("start") String start, @Param("end") String end, @Param("pg") int pg);
	public List<PointVO> selectUsedPointListSearchDate  (@Param("uid") String uid, @Param("start") String start, @Param("end") String end, @Param("pg") int pg);
	public int			 countSavePointList				(@Param("uid") String uid, @Param("start") String start, @Param("end") String end);
	public int			 countUsedPointList				(@Param("uid") String uid, @Param("start") String start, @Param("end") String end);
	
	
	//wishlist
	public void 		addWish				(WishVO vo);
	public int 			checkWish			(WishVO vo);
	public List<WishVO> selectWishlist		(@Param("uid") String uid);
	public void 		deleteSelectedWish	(@Param("wishNo") int wishNo);
	public void 		deleteAllWish		(@Param("uid") String uid);
}
