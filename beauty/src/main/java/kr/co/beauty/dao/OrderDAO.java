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

import kr.co.beauty.vo.CartVO;
import kr.co.beauty.vo.OrderVO;
import kr.co.beauty.vo.OrdercompleteVO;
import kr.co.beauty.vo.ProductOptionVO;
import kr.co.beauty.vo.TermsVO;

@Mapper
@Repository
public interface OrderDAO {
	/* 김동근 */
	//cart
	public List<CartVO> selectCartList(String arg0, String arg1);
	public void deleteSelectedCart(@Param("cartNo") int cartNo);
	public void deleteAllCart(@Param("uid") String uid);
	
	//cart - change count
	public int checkCountForUpdate(@Param("cartNo") int cartNo);
	public int cartIncrease(@Param("cartNo") int cartNo);
	public int cartDecrease(@Param("cartNo") int cartNo);

	//cart modal
	public String openOption(@Param("cartNo") int cartNo);
	public String selectOption(@Param("prodNo") int prodNo, @Param("color") String color);
	public int saveOption(CartVO vo);
	
	/********************************************************************************************************************/
	/********************************************************************************************************************/
	/* 박진휘 (주문, 주문완료 처리) */
	
	// 주문완료 검색
	public OrdercompleteVO selectOrdercomplete(int ordNo);
	// 주문제품 낱개 검색
	public List<OrderVO> selectOrder(int ordNo);
	
	// 주문완료전 주문 Insert
	public void insertOrder(OrderVO vo);
	// 주문완료전 장바구니 Delete
	public void deleteCart(int CartNo);
	
	// 상세보기 > 주문하기 :: 제품 검색
	public CartVO selectProdut(int prodNo);
	// 장바구니 > 주문하기 :: 장바구니 검색
	public CartVO selectCart(int cartNo);
	
	//구매약관
	public TermsVO orderTerms();
	
	// 주문완료전 주문완료 Insert
	public void completeInsert(OrdercompleteVO vo);
	
	// 유저 포인트 차감,적립
	public void updateMemberPoint(OrdercompleteVO vo);
}
